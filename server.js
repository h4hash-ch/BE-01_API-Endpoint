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
    { id: 1, title: "Task 1", done: true },
    { id: 2, title: "Task 2", done: false },
    { id: 3, title: "Task 3", done: false }
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
    res.json(tasks);
});

// Get one task by ID
app.get("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({
            error: `Task ${taskId} not found`
        });
    }

    res.json(task);
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

    // Generate next ID
    const nextId =
        tasks.length > 0
            ? Math.max(...tasks.map(task => task.id)) + 1
            : 1;

    const newTask = {
        id: nextId,
        title: title.trim(),
        done: false
    };

    tasks.push(newTask);

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