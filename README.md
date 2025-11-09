
# Customer ROI Dashboard (Sales Engineer Demo)

This project showcases end-to-end skills for Sales Engineering roles: API integration, value/ROI storytelling, and demo delivery.

## Live Demo
(Deploy frontend to Vercel and backend to Render/Fly/EC2. See docs/deployment.md)

### Demo Credentials
- email: `demo@demo.com`
- password: `demo123`

## Screenshots / Diagram
See `docs/architecture-diagram.png`

## Quick Start

### 1) Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Pitch Script
See `docs/demo-script.md`

## Stack
- FastAPI (Python), ReportLab for PDF
- React + Vite, Recharts, Axios

## Why this is good for Sales Engineering
- Shows business value (ROI) in minutes
- Ready to demo with fake data or connect real APIs later
- Clean code + clear README + exportable report for execs

## Next Steps
- Hook into HubSpot/OAuth for real deals
- Swap mock data with customer exports (CSV -> upload UI)
- Add role-based sharing (AE/SE/Exec)
