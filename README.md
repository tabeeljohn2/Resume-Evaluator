# Resume Evaluator

An AI-powered web app that analyzes resumes and returns structured feedback and a score. The Flask backend handles resume processing and evaluation, and the Next.js frontend provides the upload interface and results page.

## Structure

- `backend/` : Flask API
- `frontend/` : Next.js app

## Run locally

1. Backend: create a venv in `backend/`, then `pip install -r requirements.txt`
2. Frontend: run `npm install` in `frontend/`
3. Create `backend/.env` and `frontend/.env.local` with your keys
4. From `frontend/`, run `npm run dev` to start both servers together
