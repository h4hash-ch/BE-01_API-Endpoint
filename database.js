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

async function getAllTasks() {
    const result = await pool.query(
        "SELECT * FROM tasks"
    );

    return result.rows;
}

async function getTaskById(id) {
    const result = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [id]
    );

    return result.rows[0];
}

async function createTask(title) {
    const result = await pool.query(
        `
        INSERT INTO tasks (title, done)
        VALUES ($1, $2)
        RETURNING *
        `,
        [title, false]
    );

    return result.rows[0];
}

async function updateTask(id, title, done) {
    const result = await pool.query(
        `
        UPDATE tasks
        SET title = $1,
            done = $2
        WHERE id = $3
        RETURNING *
        `,
        [title, done, id]
    );

    return result.rows[0];
}

async function deleteTask(id) {
    await pool.query(
        "DELETE FROM tasks WHERE id = $1",
        [id]
    );
}

module.exports = {
    initializeDatabase,
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};