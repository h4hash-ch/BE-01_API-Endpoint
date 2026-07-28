///////////////Stage 5: Publish Database Project/////////////////

const Database = require("better-sqlite3");

console.log("Opening database...");
const db = new Database("tasks.db");
console.log("Database opened.");

//Creating Table named "tasks" if it doesn't exist
db.exec(`
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    done BOOLEAN
)
`);

const rowCount = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

if (rowCount.count === 0) {
    const insert = db.prepare(
        "INSERT INTO tasks (title, done) VALUES (?, ?)"
    );

    insert.run("Learn SQLite", 0);
    insert.run("Build CRUD API", 0);
    insert.run("Test the API", 1);

    console.log("Seeded example tasks.");
}

console.log("Starting server...");

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

///////All Endpoints///////
// Root endpoint
app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

// Health endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// Get all tasks
app.get("/tasks", (req, res) => {
    const rows = db.prepare(
        "SELECT * FROM tasks"
    ).all();
    res.json(rows);
});

// Get one task by ID
app.get("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const row = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(taskId);

    if (!row) {
        return res.status(404).json({
            error: `Task ${taskId} not found`
        });
    }
    res.json(row);
});

// Create a new task
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    // Validate input
    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    // Insert task into database
    const result = db.prepare(
        "INSERT INTO tasks (title, done) VALUES (?, ?)"
    ).run(title.trim(), 0);

    // Get the newly created task
    const newTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json(newTask);
});

// Update a task
app.put("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const { title, done } = req.body;

    // Validate body
    if (
        typeof title !== "string" ||
        title.trim() === "" ||
        typeof done !== "boolean"
    ) {
        return res.status(400).json({
            error: "Invalid request body. title must be a string and done must be boolean."
        });
    }

    // Check if task exists
    const existingTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(taskId);

    if (!existingTask) {
        return res.status(404).json({
            error: `Task ${taskId} not found`
        });
    }

    // Update database
    db.prepare(
        "UPDATE tasks SET title = ?, done = ? WHERE id = ?"
    ).run(title.trim(), done ? 1 : 0, taskId);

    // Return updated task
    const updatedTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(taskId);

    res.status(200).json(updatedTask);
});


// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    // Check if task exists
    const existingTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(taskId);

    if (!existingTask) {
        return res.status(404).json({
            error: `Task ${taskId} not found`
        });
    }

    // Delete from database
    db.prepare(
        "DELETE FROM tasks WHERE id = ?"
    ).run(taskId);

    // Empty response
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});