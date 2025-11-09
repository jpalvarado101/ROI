
# Deployment Guide

## Backend (Render)
1. Create a new Web Service.
2. Runtime: Python 3.11
3. Build Command: `pip install -r backend/requirements.txt`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Root Directory: `backend`
6. Expose on port `$PORT` (Render sets it automatically).

## Frontend (Vercel)
1. Import the repo.
2. Framework: Vite
3. Root Directory: `frontend`
4. Set env var: `VITE_API_URL=https://<your-backend-host>`
5. Build Command: `npm run build`
6. Output: `dist`

## Local Dev
- Start backend at `http://localhost:8000`
- Start frontend at `http://localhost:5173`
- Ensure `VITE_API_URL` points to backend.
