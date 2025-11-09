
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import ROIChart from '../components/ROIChart.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Dashboard({ token, user, onLogout }){
  const [usage, setUsage] = useState([])
  const [loading, setLoading] = useState(true)
  const [licenseCost, setLicenseCost] = useState(1200)
  const [implCost, setImplCost] = useState(3500)
  const [summary, setSummary] = useState(null)

  useEffect(()=>{
    const fetchUsage = async()=>{
      setLoading(true)
      const res = await axios.get(`${API}/data/usage?demo=true`)
      setUsage(res.data.usage)
      setLoading(false)
    }
    fetchUsage()
  }, [])

  useEffect(()=>{
    const calculate = async()=>{
      if(usage.length === 0) return
      const res = await axios.post(`${API}/roi`, {
        license_cost_month: Number(licenseCost),
        implementation_cost: Number(implCost),
        usage: usage
      })
      setSummary(res.data.summary)
    }
    calculate()
  }, [usage, licenseCost, implCost])

  const downloadPDF = async()=>{
    const res = await axios.post(`${API}/report/pdf`, {
      license_cost_month: Number(licenseCost),
      implementation_cost: Number(implCost),
      usage: usage
    }, { responseType: 'blob' })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customer_value_report.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{fontFamily:'system-ui', padding:20}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{margin:0}}>Customer ROI Dashboard</h2>
          <p style={{margin:0, opacity:.7}}>Welcome, {user?.name}</p>
        </div>
        <button onClick={onLogout} style={{padding:'8px 12px', borderRadius:8}}>Logout</button>
      </header>

      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16}}>
        <div style={{border:'1px solid #eee', borderRadius:12, padding:16}}>
          <h3>Assumptions</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            <label>License Cost / month</label>
            <input type="number" value={licenseCost} onChange={e=>setLicenseCost(e.target.value)} />
            <label>Implementation Cost</label>
            <input type="number" value={implCost} onChange={e=>setImplCost(e.target.value)} />
          </div>
          <p style={{fontSize:12, opacity:.7, marginTop:8}}>Savings per event defaults to $0.37 (demo)</p>
        </div>
        <div style={{border:'1px solid #eee', borderRadius:12, padding:16}}>
          <h3>Summary</h3>
          {summary ? (
            <ul>
              <li><b>Total Events:</b> {summary.total_events}</li>
              <li><b>Total Savings:</b> ${summary.total_savings}</li>
              <li><b>Total Cost:</b> ${summary.total_cost}</li>
              <li><b>Net Benefit:</b> ${summary.net_benefit}</li>
              <li><b>ROI:</b> {summary.roi_pct}%</li>
              <li><b>Payback:</b> {summary.payback}</li>
            </ul>
          ) : <p>Calculating…</p>}
          <button onClick={downloadPDF} style={{padding:'8px 12px', borderRadius:8}}>Download PDF Report</button>
        </div>
      </section>

      <section style={{border:'1px solid #eee', borderRadius:12, padding:16, marginTop:16}}>
        <h3>Usage</h3>
        {loading ? <p>Loading demo data…</p> : <ROIChart data={usage} />}
      </section>
    </div>
  )
}
