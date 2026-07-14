console.log("Starting server...");

const express = require("express");

const app = express();
const PORT = 3000;
const tasks = [{ id: 1, title: "Task 1", done: "True" },
{ id: 2, title: "Task 2", done: "False" },
{ id: 3, title: "Task 3", done: "False" }
];


///////////////////Stage 2: List and Single Task/////////////////////

// Endpoints
app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "Version 1",
        endpoints: ["/tasks"]
    });
});

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ error: `Task ${taskId} not found` });
    }
    res.json(task);
});


//Health Endpoint (to check server, a professional practice in the industry)
app.get("/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});