# A2: Connecting your CRUD API to SQLite Database

This project is the continuation of **Assignment 1: Build your first CRUD API**.

In Assignment 1, tasks were stored temporarily in memory. In this assignment, the storage layer has been replaced with a real **SQLite database**, allowing tasks to survive server restarts.

The API endpoints remain unchanged:

```
Client → Express API → SQLite Database (tasks.db)
```

The client still interacts with the same CRUD endpoints, but the data is now permanently stored inside `tasks.db`.

---

# Features

* Express.js REST API
* Full CRUD operations for tasks
* SQLite database integration
* Persistent task storage
* Automatic database and table creation
* Automatic seeding of example tasks
* Parameterized SQL queries for safer database operations
* JSON request/response handling
* Input validation
* Swagger UI API documentation

---

# Why SQLite?

SQLite was chosen because it is:

* Lightweight and requires no separate database server
* Stored as a single file (`tasks.db`)
* Easy to set up and maintain
* Suitable for small applications and learning projects
* Persistent across application restarts

Unlike the previous in-memory storage, SQLite saves data directly to disk, meaning created tasks remain available even after stopping and restarting the server.

---

# Installation & Running

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd be-01
```

---

## 2. Install dependencies

```bash
npm install
```

This installs all required Node.js packages, including the SQLite database library.

---

## 3. Start the server

```bash
node server.js
```

The API will run at:

```
http://localhost:3000
```

Swagger documentation is available at:

```
http://localhost:3000/docs
```

---

# Database Setup

The database is created automatically when the application starts.

The first run creates:

```
tasks.db
```

Inside the database, a table named `tasks` is created:

| Column | Type    | Description                                  |
| ------ | ------- | -------------------------------------------- |
| id     | INTEGER | Primary key generated automatically          |
| title  | TEXT    | Task title                                   |
| done   | INTEGER | Task completion status (0 = false, 1 = true) |

Example initial data is inserted only when the table is empty.

Restarting the application does not create duplicate tasks.

---

# API Endpoints

The API contract remains the same as Assignment 1.

| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/`          | Returns API information |
| GET    | `/health`    | Health check endpoint   |
| GET    | `/tasks`     | Get all tasks           |
| GET    | `/tasks/:id` | Get a single task by ID |
| POST   | `/tasks`     | Create a new task       |
| PUT    | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task           |

---

# Example API Usage

## Get all tasks

### Request

```bash
curl.exe -i http://localhost:3000/tasks
```

### Response

```json
[
  {
    "id": 1,
    "title": "Learn SQLite",
    "done": false
  },
  {
    "id": 2,
    "title": "Build CRUD API",
    "done": false
  },
  {
    "id": 3,
    "title": "Test the API",
    "done": true
  }
]
```

---

## Create a task

### Request

```bash
curl.exe -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d "{\"title\":\"Learn SQLite\"}"
```

### Response

```json
{
  "id": 4,
  "title": "Another Task Created",
  "done": false
}
```

---

## Update a task

### Request

```bash
curl.exe -X PUT http://localhost:3000/tasks/4 \
-H "Content-Type: application/json" \
-d "{\"title\":\"Another Task Created\",\"done\":true}"
```

---

## Delete a task

### Request

```bash
curl.exe -X DELETE http://localhost:3000/tasks/4
```

Successful deletion returns:

```
204 No Content
```

---

# Project Structure

```
be-01/
│
├── server.js              # Express API server
├── openapi.json           # Swagger/OpenAPI specification
├── tasks.db               # SQLite database (generated automatically)
├── package.json           # Project dependencies
├── package-lock.json
├── images/
└── README.md              # Documentation
```

Note: `tasks.db` is usually added to `.gitignore` so every new clone can automatically generate its own database.

---

# Database CRUD Implementation

The API now uses SQL queries instead of an in-memory array.

Examples:

## Read tasks

```sql
SELECT * FROM tasks;
```

## Find a task by ID

```sql
SELECT * FROM tasks WHERE id = ?;
```

## Insert a task

```sql
INSERT INTO tasks (title, done)
VALUES (?, ?);
```

## Update a task

```sql
UPDATE tasks
SET title = ?, done = ?
WHERE id = ?;
```

## Delete a task

```sql
DELETE FROM tasks WHERE id = ?;
```

All user input is passed using parameterized queries instead of being directly inserted into SQL strings.

---

# Technologies Used

* Node.js
* Express.js
* SQLite
* better-sqlite3
* Swagger UI Express
* OpenAPI Specification

---

# Stage Progress

Completed stages:

* Stage 0: Created SQLite database and tasks table
* Stage 1: Connected GET endpoints to database queries
* Stage 2: Added database INSERT operations
* Stage 3: Added database UPDATE and DELETE operations
* Stage 4: Explored SQLite manually using DB Browser
* Stage 5: Published database project documentation

---

# Requirements Checklist

Completed requirements:

* ✅ CRUD API endpoints remain unchanged from Assignment 1
* ✅ Tasks are stored in SQLite instead of memory
* ✅ Data survives server restarts
* ✅ Database file is created automatically
* ✅ Tasks table is created automatically
* ✅ Example tasks are seeded only once
* ✅ SQL queries use parameterized placeholders
* ✅ Correct HTTP status codes are preserved:

* 200 OK
* 201 Created
* 204 No Content
* 400 Bad Request
* 404 Not Found

---

# Summary

This assignment replaced temporary in-memory storage with a persistent SQLite database while keeping the API behaviour unchanged.

The main improvement is persistence: tasks created through the API are now saved permanently and remain available after restarting the server.
