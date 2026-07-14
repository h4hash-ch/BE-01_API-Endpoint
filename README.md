# Build your first CRUD API

A simple CRUD Task API built with **Node.js** and **Express.js**.

This project provides REST API endpoints to create, read, update, and delete tasks. It also includes interactive API documentation using **Swagger UI**, available at `/docs`.

## Features

* Express.js REST API
* Full CRUD operations for tasks
* JSON request/response handling
* Input validation
* Swagger UI documentation with Try It Out functionality

## Installation & Running

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd be-01
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

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

# API Endpoints

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

## Read all the Tasks
On my PC (Windows), `curl.exe` was used instead of `curl` to avoid command alias issues I was facing. In your case, `curl` might work properly.
### Request

```bash
curl.exe -i http://localhost:3000/tasks/
```

### Response

```text
HTTP/1.1 200 OK                            
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 117
ETag: W/"75-06prUSBiJoPiNZzsqZ/Bl5NXjm0"
Date: Tue, 14 Jul 2026 23:41:30 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Task 1","done":true},{"id":2,"title":"Task 2","done":false},{"id":3,"title":"Task 3","done":false}]
```

---

# Swagger UI

The API documentation is generated using Swagger UI.

It provides an interactive interface where all endpoints can be tested directly from the browser using the **Try it out** button.

![Swagger UI Screenshot](images/Swagger%20UI.png)

---

# Project Structure

```
be-01/
│
├── server.js        # Express API server
├── openapi.json     # Swagger/OpenAPI specification
├── package.json     # Project dependencies
└── README.md        # Documentation
```

---

# Technologies Used

* Node.js
* Express.js
* Swagger UI Express
* OpenAPI Specification

---

# Stage Progress

Completed stages:

* Stage 1: Basic Express server
* Stage 2: Task API setup
* Stage 3: CRUD operations
* Stage 4: Update and Delete functionality
* Stage 5: Swagger UI documentation
* Stage 6: Publish and documentation
