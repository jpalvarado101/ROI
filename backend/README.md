
# Backend (FastAPI)

## Quickstart
```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Endpoints:
- `GET /health`
- `POST /auth/login` (demo credentials)
- `GET /data/usage?demo=true`
- `POST /roi`
- `POST /report/pdf`
