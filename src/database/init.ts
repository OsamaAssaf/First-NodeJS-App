import pool from "../config/database";
import fs from "fs";
import path from "path";

async function initializeDatabase() {
  try {
    console.log("Initializing database...");

    // Read the SQL initialization file
    const sqlPath = path.join(__dirname, "init.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    // Split the SQL content by semicolons to execute multiple statements
    const statements = sqlContent
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("Database setup complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database setup failed:", error);
      process.exit(1);
    });
}

export default initializeDatabase;
