console.log("Starting server...");

const express = require("express");

const app = express();
const PORT = 3000;

// Endpoint 1
app.get("/", (req, res) => {
    res.json({ message: "Hello, Backend!" });
});

// Endpoint 2
app.get("/about", (req, res) => {
    res.json({
        assignment: "BE-01 - Built First API endpoint using Express.js",
        author: "HASHIM CHOUDHRY"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});