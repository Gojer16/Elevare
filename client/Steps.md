# 🚦 Scripts Guide

This doc explains exactly what to do for each environment (dev, test, prod).
Follow it step by step — don’t improvise.

## 🛠 Development (Local)

Goal: Work locally with your dev database (.env.local).

# Rules

- Always run migrations with migrate dev (creates new migrations if schema changed).
- This will also update your local database schema automatically.

## Scripts: 
```
npx prisma migrate dev --name [your_migration_name]
```
## Output:

- Applies migrations to your local dev DB.
- If schema changed, prompts you to create a new migration.

## 🧪 Testing

Goal: Keep a clean, migrated test DB (.env.local).

# Rules

- Use migrate deploy for test (never dev) — this only applies existing migrations, never creates new ones.
- Before running tests, reset DB so it starts clean.

## Scripts
```
Reset test DB (fresh start):
npx prisma migrate reset --force --skip-generate --skip-seed


Apply migrations only (no reset):
npx prisma migrate deploy
```
## Output:

- reset: Wipes the DB, re-applies all migrations.
- migrate: Applies any pending migrations only.


## 🚨 Production

# ⚠️ Be very careful here — you can break real data.

## Rules

- Never run migrate dev in prod.
- Always use migrate deploy — this applies only safe, already-committed migrations.
- Double-check your .env.production before executing.


## Script

```
prisma migrate deploy --env-file .env.production
```

## Output:

- Applies all migrations to the production DB.
- No schema prompts, no destructive changes unless explicitly coded.