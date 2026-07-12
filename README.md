# Assignment: BE-01-Build Your First API Endpoint

A simple backend API built with **Node.js** and **Express.js** as part of the Backend AI Engineering track at FlyRank AI.

## Features

* Two JSON API endpoints
* Tested using browser and curl
* Published using Git and GitHub

## Endpoints

### GET `/`

Returns a welcome message.

Response:

```json
{
  "message": "Hello, Backend!"
}
```

### GET `/about`

Returns assignment information.

Response:

```json
{
  "assignment": "BE-01 - Built First API endpoint using Express.js",
  "author": "HASHIM CHOUDHRY"
}
```

## Run Locally

Clone the repository:

```bash
git clone <repository-url>
cd be-01
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

The API will run at:

```
http://localhost:3000
```

## Technologies Used

* Node.js
* Express.js
* Git & GitHub
