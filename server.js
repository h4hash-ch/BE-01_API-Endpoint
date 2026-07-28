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

const tasks = [
    { id: 1, title: "Harcoded Task", done: true },
];

/////////////////// Stage 5: Swagger UI /////////////////////

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
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({
            error: `Task ${taskId} not found`
        });
    }

    const { title, done } = req.body;

    // Empty body validation
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Request body cannot be empty"
        });
    }

    // Validate title if provided
    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                error: "Title must be a non-empty string"
            });
        }

        task.title = title.trim();
    }

    // Validate done if provided
    if (done !== undefined) {
        if (typeof done !== "boolean") {
            return res.status(400).json({
                error: "Done must be true or false"
            });
        }

        task.done = done;
    }

    res.status(200).json(task);
});


// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            error: `Task ${taskId} not found`
        });
    }

    tasks.splice(taskIndex, 1);

    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});