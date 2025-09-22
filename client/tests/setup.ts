import 'dotenv/config'
import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

// Test configuration & constants
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  process.env.DATABASE_URL?.replace(/\/[^/]+(\?|$)/, '/elevare_test$1') ||
  'postgresql://postgres:postgres@localhost:5433/elevare_test'

const TEST_CONFIG = {
  database: {
    url: TEST_DATABASE_URL,
    maxConnections: 5,
    connectionTimeout: 5000,
  },
  auth: {
    secret: 'test-secret-key-for-testing-only',
    sessionMaxAge: 24 * 60 * 60,
    providers: { credentials: { enabled: true }, google: { enabled: false } },
  },
  api: {
    timeout: 5000,
    retries: 3,
    rateLimit: { enabled: false },
  },
  test: {
    timeout: 10000,
    retries: 2,
    parallel: true,
    coverage: { threshold: 80 },
  },
}

export const MOCK_SERVICES = {
  email: { enabled: false, provider: 'mock' },
  analytics: { enabled: false, provider: 'mock' },
  ai: { enabled: false, provider: 'mock' },
}

export const TEST_CONSTRAINTS = {
  user: { maxTasks: 100, maxTags: 50, maxReflections: 200 },
  task: { titleMaxLength: 200, descriptionMaxLength: 1000, maxTags: 10 },
  reflection: { contentMaxLength: 2000, maxPerTask: 5 },
}

// Global test DB client
let testPrisma!: PrismaClient

declare global {
  var testDb: PrismaClient
  var prisma: PrismaClient
}
globalThis.testDb = testPrisma

// Env setup helpers
function setupTestEnvironment() {
  Object.entries({
    NODE_ENV: 'test',
    NEXTAUTH_SECRET: TEST_CONFIG.auth.secret,
    NEXTAUTH_URL: 'http://localhost:3000',
    DATABASE_URL: TEST_CONFIG.database.url,
    TEST_DATABASE_URL: TEST_CONFIG.database.url,
  }).forEach(([key, value]) => {
    process.env[key] = value
  })

  if (process.env.SILENT_TESTS === 'true') {
    console.log = vi.fn() as unknown as typeof console.log
    console.info = vi.fn() as unknown as typeof console.info
    console.warn = vi.fn() as unknown as typeof console.warn
  }
}

function cleanupTestEnvironment() {
  delete process.env.TEST_DATABASE_URL

  if (process.env.SILENT_TESTS === 'true') {
    vi.restoreAllMocks()
  }
}

function replaceDatabaseInUrl(urlStr: string, newDb: string) {
  try {
    const u = new URL(urlStr)
    u.pathname = `/${newDb}`
    return u.toString()
  } catch (err) {
    return urlStr.replace(/(postgres(?:ql)?:\/\/[^/]+)\/[^?]+/, `$1/${newDb}`)
  }
}

function extractDbName(urlStr: string) {
  try {
    const u = new URL(urlStr)
    return u.pathname?.replace(/^\//, '').split('?')[0]
  } catch {
    const match = urlStr.match(/\/([^/?]+)(\?|$)/)
    return match ? match[1] : 'test_db'
  }
}

async function ensureDatabaseExists(dbUrl: string) {
  const dbName = extractDbName(dbUrl)
  const adminUrl = replaceDatabaseInUrl(dbUrl, 'postgres')

  try {
    const adminPrisma = new PrismaClient({
      datasources: { db: { url: adminUrl } },
    })
    await adminPrisma.$connect()
    const exists = (await adminPrisma.$queryRaw<
      Array<{ datname: string }>
    >`SELECT datname FROM pg_database WHERE datname = ${dbName}`)[0]

    if (!exists) {
      console.log(`Creating database "${dbName}" via admin connection...`)
      await adminPrisma.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`)
      console.log(`Database "${dbName}" created.`)
    } else {
      console.log(`Database "${dbName}" already exists.`)
    }

    await adminPrisma.$disconnect()
    return
  } catch (_err) {
    console.warn(
      'Creating database via admin Prisma client failed (will attempt psql fallback):',
      (_err as Error).message ?? _err
    )
  }

  try {
    const parsed = new URL(dbUrl)
    const host = parsed.hostname
    const port = parsed.port || '5432'
    const user = parsed.username || 'postgres'
    const password = parsed.password || ''
    const dbNameEscaped = dbName.replace(/"/g, '""')
    const psqlCmd = `psql -h ${host} -p ${port} -U ${user} -c "CREATE DATABASE \\"${dbNameEscaped}\\";"`

    console.log('Attempting to create database using psql fallback...')
    execSync(psqlCmd, {
      stdio: 'inherit',
      env: { ...process.env, PGPASSWORD: password },
    })
    console.log(`Database "${dbName}" created via psql fallback.`)
    return
  } catch (err) {
    console.warn('psql fallback failed:', (err as Error).message ?? err)
    throw new Error(
      `Failed to create database "${extractDbName(
        dbUrl
      )}". Ensure the Postgres server is reachable and the user has CREATE DATABASE privileges.`
    )
  }
}

// Vitest lifecycle hooks
beforeAll(async () => {
  setupTestEnvironment()

  try {
    console.log('Ensuring test database exists...')
    await ensureDatabaseExists(TEST_DATABASE_URL)

    console.log('Pushing Prisma schema to test database...')
    // <-- FIX: DO NOT pass --url; set DATABASE_URL in env instead
    execSync('npx prisma db push', {
      env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
      stdio: 'inherit',
    })

    // Initialize test Prisma client pointing at the test DB
    testPrisma = new PrismaClient({
      datasources: { db: { url: TEST_DATABASE_URL } },
    })
    globalThis.testDb = testPrisma
    globalThis.prisma = testPrisma // Override global prisma client for tests

    // Mock the prisma import in API routes
    vi.mock('../../../app/lib/prisma', () => ({
      prisma: testPrisma
    }))

    await testPrisma.$connect()
    console.log('Test database connected successfully')
  } catch (error) {
    console.error('Failed to setup test database:', error)
    throw error
  }
})

afterAll(async () => {
  try {
  if (testPrisma) await testPrisma.$disconnect()
  // Reset global prisma client if present
  Reflect.deleteProperty(globalThis, 'prisma')
    console.log('Test database disconnected')
  } catch (error) {
    console.error('Error during test database cleanup:', error)
  } finally {
    cleanupTestEnvironment()
  }
})

beforeEach(async () => {
  // Start a transaction for each test
  await testPrisma.$executeRaw`BEGIN`
})

afterEach(async () => {
  try {
    // Rollback the transaction to undo all changes
    await testPrisma.$executeRaw`ROLLBACK`
  } catch (error) {
    console.warn('Transaction rollback failed, performing manual cleanup:', error)
    await cleanupDatabase()
  }
})

async function cleanupDatabase() {
  const tablenames = await testPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await testPrisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE`
        )
      } catch (error) {
        console.warn(`Failed to truncate table ${tablename}:`, error)
      }
    }
  }
}

export { testPrisma }
