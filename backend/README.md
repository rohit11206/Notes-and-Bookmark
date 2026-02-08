# Backend - Personal Notes & Bookmark Manager

This is the Node.js + Express + MongoDB backend for the Personal Notes & Bookmark Manager.

It exposes a secure REST API for:
- User authentication (JWT)
- Notes CRUD with tag-based search and favorites
- Bookmarks CRUD with URL validation, tag-based search, favorites, and optional auto-title fetching

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Zod (request validation)
- JWT + bcrypt (authentication)
- Helmet, CORS, rate limiting (security)

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy the example env file and update the values:

```bash
cp .env.example .env
``` 

Required variables:

- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – strong secret key for signing JWTs
- `PORT` – API port (default `4000`)
- `CORS_ORIGIN` – frontend origin (default `http://localhost:3000`)

### 3. Run the server

```bash
npm run dev
# or
npm start
```

Server will start on `http://localhost:4000` by default.

## API Overview

Base URL: `http://localhost:4000`

All protected routes require a Bearer token:

`Authorization: Bearer <JWT_TOKEN>`

### Auth API

- `POST /api/auth/register`
  - Body: `{ "email", "password", "name?" }`
  - Returns: `{ token, user }`

- `POST /api/auth/login`
  - Body: `{ "email", "password" }`
  - Returns: `{ token, user }`

### Notes API

- `POST /api/notes`  
  Create a note.
  - Body:
    - `title` (required, string)
    - `content` (optional, string)
    - `tags` (optional, array of strings)
    - `isFavorite` (optional, boolean)

- `GET /api/notes?q=searchTerm&tags=tag1,tag2`  
  List notes for the authenticated user, optionally filtered by:
  - `q`: full-text search on `title` and `content`
  - `tags`: comma-separated tags

- `GET /api/notes/:id`  
  Get a single note by id (owned by the user).

- `PUT /api/notes/:id`  
  Update a note (any subset of note fields, including `isFavorite`).

- `DELETE /api/notes/:id`  
  Delete a note (204 on success).

### Bookmarks API

- `POST /api/bookmarks`  
  Create a bookmark.
  - Body:
    - `url` (required, valid URL)
    - `title` (optional; if omitted, backend will try to fetch `<title>` from the page)
    - `description` (optional)
    - `tags` (optional, array of strings)
    - `isFavorite` (optional, boolean)

- `GET /api/bookmarks?q=searchTerm&tags=tag1,tag2`  
  List bookmarks for the authenticated user, optionally filtered by:
  - `q`: search in `title`, `description`, and `url`
  - `tags`: comma-separated tags

- `GET /api/bookmarks/:id`  
  Get a single bookmark by id (owned by the user).

- `PUT /api/bookmarks/:id`  
  Update a bookmark (any subset of bookmark fields, including `isFavorite`).

- `DELETE /api/bookmarks/:id`  
  Delete a bookmark (204 on success).

## Validation & Error Handling

- All request bodies and query parameters are validated with Zod (`src/utils/validation.js`).
- URL validation for bookmarks is enforced at the schema level.
- Errors are returned as JSON with consistent shape:

```json
{
  "error": "ErrorName",
  "message": "Human-readable message",
  "details": [ /* optional validation details */ ]
}
```

## Security

- JWT-based auth with `Bearer` tokens.
- Passwords are never stored in plain text (`bcrypt` hashes only).
- `helmet` for HTTP headers hardening.
- `express-rate-limit` to limit requests on `/api/*`.
- CORS configured to only allow the configured frontend origin.

