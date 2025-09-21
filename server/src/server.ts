import { app } from "./app";
import Database from "better-sqlite3";

const PORT = process.env.PORT || 5000;

// Decide which SQLite DB file to use based on environment
let dbFile: string;
switch (process.env.NODE_ENV) {
  case "production":
    dbFile = process.env.DB_FILE_PROD || "elevare_prod.db";
    break;
  case "test":
    dbFile = process.env.DB_FILE_TEST || ":memory:"; // in-memory DB for tests
    break;
  default:
    dbFile = process.env.DB_FILE_DEV || "elevare_dev.db";
    break;
}

// Initialize SQLite DB
try {
  const db = new Database(dbFile);
  console.log(`Connected to SQLite ✅ (${process.env.NODE_ENV}) using ${dbFile}`);

  // Example: ensure feedback table exists
  db.prepare(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      suggestionName TEXT,
      suggestionRationale TEXT,
      feedback TEXT
    )
  `).run();

  // Expose db globally (optional, but convenient)
  (global as any).db = db;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (err) {
  console.error("❌ SQLite connection failed", err);
  process.exit(1);
}
