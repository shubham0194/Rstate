# Rstate

Rstate is a property/room management app with a public listing flow and an admin dashboard for managing rooms.

## Project overview

This project is split into two main parts:

- Client: React + Vite frontend
- Server: Express backend API

The app currently supports:

- public room listing
- single room details view
- admin room creation
- admin room update
- admin room deletion
- basic health check endpoint

## Tech stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- CORS
- Dotenv

## Current app flow

### Public flow
- `/` -> Home page
- `/rooms` -> all rooms listing page
- `/room/:id` -> single room detail page
- `/favorites` -> favorites page
- `/login` -> login page
- `/about` -> about page

### Admin flow
- `/admin` -> admin landing
- `/admin/dashboard` -> dashboard
- `/admin/AddRoom` -> add new room form
- `/admin/rooms` -> admin room list with edit/delete options
- `/admin/edit/:id` -> edit a specific room

## Folder structure

```bash
Rstate/
├── client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── readme.md
├── phases.txt
├── structure.txt
└── to-do
```

## Backend API

The backend runs on port `5001`.

### Health check

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "Rstate server is healthy"
}
```

### Room routes

```http
GET /rooms
POST /rooms
GET /rooms/:id
PUT /rooms/:id
DELETE /rooms/:id
```

The current room data is stored in-memory inside the server controller for development/testing. It is not yet connected to a database.

## Local setup

### 1. Install dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd client
npm install
```

### 2. Start the backend

```bash
cd server
npm run nodemon
```

The server should run at:

```text
http://localhost:5001
```

### 3. Start the frontend

```bash
cd client
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

## Room data shape

Current room objects follow this structure:

```json
{
  "id": 1,
  "name": "Room 1",
  "description": "This is room 1",
  "capacity": 10,
  "location": "Nairobi",
  "price": 1200,
  "status": "available"
}
```

## Admin actions

The current admin flow allows:

- add room
- view all rooms
- edit room by id
- delete room by id

## Notes

- The project is currently using mock/in-memory room data in the backend.
- A real database layer can be added later for persistence.
- The room routes and frontend route names are set up for a clean CRUD flow and can be expanded further.

## Next possible improvements

- connect MongoDB or another database
- add authentication for admin routes
- add validation for room inputs
- add image upload for room listings
- improve error handling and loading states
