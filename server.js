console.log("Starting server...");

const express = require("express");

const app = express();
const PORT = 3000;


///////////////////Stage 1: Your First Real API Endpoint/////////////////////

// Endpoint
app.get("/", (req, res) => {
    res.json({ 
        name: "Task API",
        version: "Version 1",
        endpoints: ["/tasks"]
     });
});

app.get("/health", (req, res) => {
    res.json({ 
        status: "OK"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});