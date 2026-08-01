const pool = require("./db");

async function initializeDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN DEFAULT FALSE
        )
    `);

    const rowCount = await pool.query(
        "SELECT COUNT(*) FROM tasks"
    );

    if (rowCount.rows[0].count === "0") {
        await pool.query(`
            INSERT INTO tasks(title, done)
            VALUES
            ('Learn PostgreSQL (switched from SQLite)', false),
            ('Build CRUD API', false),
            ('Test the API', true)
        `);

        console.log("Seeded example tasks.");
    }
}

module.exports = initializeDatabase;