console.log("Starting server...");

const express = require("express");

const app = express();
const PORT = 3000;

// Endpoint 1
app.get("/", (req, res) => {
    res.json({ message: "Hello Server" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});