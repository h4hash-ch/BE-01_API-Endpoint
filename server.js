require("dotenv").config();

console.log("Starting server...");

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const pool = require("./db");
const initializeDatabase = require("./database");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

///////////////////////////
///////All Endpoints///////
///////////////////////////

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
app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: "Database error"
        });
    }
});

// Get one task by ID
app.get("/tasks/:id", async (req, res) => {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
        return res.status(400).json({
            error: "Invalid task id"
        });
    }

    const result = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [taskId]
    );

    const row = result.rows[0];

    if (!row) {
        return res.status(404).json({
            error: `Task ${taskId} not found`
        });
    }
    res.json(row);
});

// Create a new task
app.post("/tasks", async (req, res) => {
    const { title } = req.body;

    // Validate input
    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    // Insert task into database
    const result = await pool.query(
        `
    INSERT INTO tasks (title, done)
    VALUES ($1, $2)
    RETURNING *
    `,
        [title.trim(), false]
    );

    const newTask = result.rows[0];

    res.status(201).json(newTask);
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
        return res.status(400).json({
            error: "Invalid task id"
        });
    }

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
    const existingResult = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [taskId]
    );

    const existingTask = existingResult.rows[0];

    if (!existingTask) {
        return res.status(404).json({
            error: `Task ${taskId} not found`
        });
    }

    // Update database
    await pool.query(
        `
    UPDATE tasks
    SET title = $1, done = $2
    WHERE id = $3
    `,
        [title.trim(), done, taskId]
    );

    // Return updated task
    const updatedResult = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [taskId]
    );

    const updatedTask = updatedResult.rows[0];

    res.status(200).json(updatedTask);
});


// Delete a task
app.delete("/tasks/:id", async (req, res) => {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
        return res.status(400).json({
            error: "Invalid task id"
        });
    }

    // Check if task exists
    const existingResult = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [taskId]
    );

    const existingTask = existingResult.rows[0];

    if (!existingTask) {
        return res.status(404).json({
            error: `Task ${taskId} not found`
        });
    }

    // Delete from database
    await pool.query(
        "DELETE FROM tasks WHERE id = $1",
        [taskId]
    );

    // Empty response
    res.status(204).send();
});

async function startServer() {
    await initializeDatabase();

    app.listen(PORT, () => {
        console.log(
            `Server running on http://localhost:${PORT}`
        );
    });
}

startServer();