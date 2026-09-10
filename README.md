# MonitorIQ —  Full-Stack Project 

A simple, beginner-friendly version of MonitorIQ with a real backend and
frontend talking to each other. No Docker, no database server to install -
the backend just uses a JSON file (`backend/db.json`) as its "database."

## What's in here

```
monitoriq-simple/
├── backend/     → Node.js + Express API (see backend/README below)
└── frontend/    → React app 
```

## How it works

- **Register** → saves your account to `backend/db.json` (password is hashed with bcrypt)
- **Login** → checks your email/password against saved accounts, returns a JWT token
- **Add API** → saves it to `db.json`; a scheduler in the backend checks it
  automatically every 60 seconds using a real HTTP request
- **Monitoring Logs / Incidents / Alerts** → all generated for real from
  those checks — not mock data anymore

## Running it (2 terminals)

**Terminal 1 — backend:**
```bash
cd backend
npm install
npm start
```
Runs on `http://localhost:5000`.

**Terminal 2 — frontend:**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`. Open that URL in your browser.

## Try it out

1. Go to the site → you'll land on the Login page
2. Click "Register", create an account
3. Log in with that account → you're on the Dashboard
4. Go to "APIs" → add a real API URL (try `https://jsonplaceholder.typicode.com/todos/1`,
   a free public test API that always responds)
5. Wait up to a minute (or restart the backend to trigger an immediate check)
   and refresh the Dashboard/Logs pages — you'll see real response times show up
6. Try adding a URL that doesn't exist (like `https://this-is-not-a-real-site-1234.com`)
   — after the next check, it'll show as "Down" and create a real Incident + Alert

