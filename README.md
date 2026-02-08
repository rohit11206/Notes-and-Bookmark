# Personal Notes & Bookmark Manager

Full-stack assignment implementing a secure Personal Notes & Bookmark Manager.

- **Backend**: Node.js, Express, MongoDB, JWT auth, Zod validation
- **Frontend**: Next.js (App Router), React, Tailwind CSS

Users can:
- Save, update, delete, and search **notes** with tags and favorites
- Save, update, delete, and search **bookmarks** with URL validation, tags, and favorites
- (Bonus) Auto-fetch title from bookmark URLs when not provided
- Register and log in with JWT-based authentication

---

## Project Structure

- `backend/` – REST API (Node.js + Express + MongoDB)
- `frontend/` – Next.js + Tailwind CSS UI

---

## Backend Setup

See detailed instructions in `backend/README.md`. Short version:

```bash
cd backend
npm install
cp .env.example .env
# edit .env to set MONGODB_URI and JWT_SECRET
npm run dev
```

The API will be available at `http://localhost:4000`.

Key routes (all under `/api`):
- Auth: `/api/auth/register`, `/api/auth/login`
- Notes: `/api/notes`, `/api/notes/:id`
- Bookmarks: `/api/bookmarks`, `/api/bookmarks/:id`

Query parameters:
- `GET /api/notes?q=searchTerm&tags=tag1,tag2`
- `GET /api/bookmarks?q=searchTerm&tags=tag1,tag2`

Protected routes expect `Authorization: Bearer <JWT_TOKEN>`.

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:3000`.

Main pages:
- `/login` – user login
- `/register` – user registration
- `/notes` – list, search, filter, create, edit, delete notes, toggle favorites
- `/bookmarks` – list, search, filter, create, edit, delete bookmarks, toggle favorites

The frontend calls the backend API at `http://localhost:4000/api/*`.

---

## Example cURL Requests

### Register

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123","name":"Test User"}'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123"}'
```

### Create Note

```bash
curl -X POST http://localhost:4000/api/notes \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample note","content":"Body","tags":["personal","work"],"isFavorite":false}'
```

### Create Bookmark

```bash
curl -X POST http://localhost:4000/api/bookmarks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","description":"Example site","tags":["reference"]}'
```

---

## Security & Best Practices

- Passwords hashed with `bcrypt` (never stored in plain text).
- JWT auth using secure signed tokens.
- Inputs validated with `zod` on the backend.
- `helmet` and `express-rate-limit` protect the API.
- CORS restricted to the configured frontend origin.

