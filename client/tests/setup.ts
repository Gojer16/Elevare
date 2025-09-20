import { beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest"
import { PrismaClient } from "@prisma/client"
import { execSync } from "child_process"

// Test configuration & constants
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  process.env.DATABASE_URL?.replace(/\/[^/]+(\?|$)/, "/test_db$1") ||
  "postgresql://postgres:postgres@localhost:5433/elevare_test"

const TEST_CONFIG = {
  database: {
    url: TEST_DATABASE_URL,
    maxConnections: 5,
    connectionTimeout: 5000,
  },
  auth: {
    secret: "test-secret-key-for-testing-only",
    sessionMaxAge: 24 * 60 * 60, // 24 hours
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
  email: { enabled: false, provider: "mock" },
  analytics: { enabled: false, provider: "mock" },
  ai: { enabled: false, provider: "mock" },
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
}
globalThis.testDb = testPrisma

// Env setup helpers
function setupTestEnvironment() {
  Object.entries({
    NODE_ENV: "test",
    NEXTAUTH_SECRET: TEST_CONFIG.auth.secret,
    NEXTAUTH_URL: "http://localhost:3000",
    DATABASE_URL: TEST_CONFIG.database.url,
  }).forEach(([key, value]) => {
    process.env[key] = value
  })

  if (process.env.SILENT_TESTS === "true") {
    console.log = vi.fn()
    console.info = vi.fn()
    console.warn = vi.fn()
  }
}

function cleanupTestEnvironment() {
  delete process.env.TEST_DATABASE_URL

  if (process.env.SILENT_TESTS === "true") {
    vi.restoreAllMocks()
  }
}

// Vitest lifecycle hooks
beforeAll(async () => {
  setupTestEnvironment()

  testPrisma = new PrismaClient({
    datasources: { db: { url: TEST_DATABASE_URL } },
  })
  globalThis.testDb = testPrisma

  try {
    console.log("Setting up test database...")

    execSync("npx prisma migrate deploy", {
      env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
      stdio: "inherit",
    })

    await testPrisma.$connect()
    console.log("Test database connected successfully")
  } catch (error) {
    console.error("Failed to setup test database:", error)
    throw error
  }
})

afterAll(async () => {
  try {
    await testPrisma.$disconnect()
    console.log("Test database disconnected")
  } catch (error) {
    console.error("Error during test database cleanup:", error)
  } finally {
    cleanupTestEnvironment()
  }
})

beforeEach(async () => {
  await testPrisma.$executeRaw`BEGIN`
})

afterEach(async () => {
  try {
    await testPrisma.$executeRaw`ROLLBACK`
  } catch (error) {
    console.warn("Transaction rollback failed, performing manual cleanup:", error)
    await cleanupDatabase()
  }
})

// Helpers
async function cleanupDatabase() {
  const tablenames = await testPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  for (const { tablename } of tablenames) {
    if (tablename !== "_prisma_migrations") {
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

// Export Prisma client
export { testPrisma }
