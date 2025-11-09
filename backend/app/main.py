
from fastapi import FastAPI, HTTPException, Body, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import io
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas

app = FastAPI(title="Customer ROI Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class UsagePoint(BaseModel):
    date: str
    events: int
    savings_per_event: float = 0.37

class ROIRequest(BaseModel):
    license_cost_month: float
    implementation_cost: float
    usage: List[UsagePoint]

@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat() + "Z"}

@app.post("/auth/login")
def login(payload: LoginRequest):
    # Simple demo auth (DO NOT USE IN PROD)
    if payload.email == "demo@demo.com" and payload.password == "demo123":
        return {"token": "demo-token", "name": "Demo User"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/data/usage")
def get_usage(demo: bool = True):
    # Return mock usage time series for 90 days
    from datetime import timedelta
    import random

    end = datetime.utcnow().date()
    start = end - timedelta(days=89)
    days = (end - start).days + 1

    rng = random.Random(42 if demo else None)
    series = []
    for i in range(days):
        d = start + timedelta(days=i)
        # Simulate adoption curve
        base = 50 + i * 2
        noise = rng.randint(-15, 20)
        events = max(0, base + noise)
        series.append({"date": d.isoformat(), "events": events, "savings_per_event": 0.37})
    return {"usage": series}

@app.post("/roi")
def roi(payload: ROIRequest):
    # Compute ROI metrics
    total_events = sum(p.events for p in payload.usage)
    total_savings = sum(p.events * p.savings_per_event for p in payload.usage)
    months = max(1, len(payload.usage) // 30)
    total_cost = payload.license_cost_month * months + payload.implementation_cost
    net_benefit = total_savings - total_cost
    roi_pct = (net_benefit / total_cost * 100.0) if total_cost else 0.0
    payback = "Under a month" if net_benefit > 0 and months <= 1 else (
        f"{max(1, int((payload.implementation_cost / (total_savings/months + 1e-9)) ))} months"
        if total_savings > 0 else "N/A"
    )
    return {
        "summary": {
            "total_events": total_events,
            "total_savings": round(total_savings, 2),
            "total_cost": round(total_cost, 2),
            "net_benefit": round(net_benefit, 2),
            "roi_pct": round(roi_pct, 2),
            "months": months,
            "payback": payback
        }
    }

@app.post("/report/pdf")
def report_pdf(payload: ROIRequest):
    # Build PDF report from the ROI summary
    res = roi(payload)
    summary = res["summary"]

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=LETTER)
    width, height = LETTER

    # Header
    c.setFont("Helvetica-Bold", 18)
    c.drawString(72, height - 72, "Customer Value Report")
    c.setFont("Helvetica", 10)
    c.drawString(72, height - 90, f"Generated: {datetime.utcnow().isoformat()}Z")

    # Body
    y = height - 130
    c.setFont("Helvetica-Bold", 12)
    c.drawString(72, y, "Summary")
    c.setFont("Helvetica", 11)
    y -= 20
    for k, v in [
        ("Total Events", summary["total_events"]),
        ("Total Savings ($)", summary["total_savings"]),
        ("Total Cost ($)", summary["total_cost"]),
        ("Net Benefit ($)", summary["net_benefit"]),
        ("ROI (%)", summary["roi_pct"]),
        ("Estimated Payback", summary["payback"]),
    ]:
        c.drawString(72, y, f"{k}: {v}")
        y -= 16

    y -= 10
    c.setFont("Helvetica-Bold", 12)
    c.drawString(72, y, "Assumptions")
    y -= 18
    c.setFont("Helvetica", 10)
    c.drawString(72, y, "- Savings per event assumes $0.37 (demo)")
    y -= 14
    c.drawString(72, y, "- License and implementation costs provided in request")
    y -= 14
    c.drawString(72, y, "- Usage series is 90-day demo data unless replaced with real data")

    c.showPage()
    c.save()
    pdf = buffer.getvalue()
    buffer.close()

    return Response(content=pdf, media_type="application/pdf", headers={
        "Content-Disposition": 'inline; filename="customer_value_report.pdf"'
    })
