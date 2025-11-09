
import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Login({ onSuccess }){
  const [email, setEmail] = useState('demo@demo.com')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState(null)

  const handleLogin = async (e)=>{
    e.preventDefault()
    setError(null)
    try{
      const res = await axios.post(`${API}/auth/login`, {email, password})
      onSuccess(res.data.token, {name: res.data.name, email})
    }catch(err){
      setError('Invalid credentials')
    }
  }

  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'100vh', fontFamily:'system-ui'}}>
      <div style={{width:360, padding:24, border:'1px solid #ddd', borderRadius:12}}>
        <h2>Customer ROI Dashboard</h2>
        <p style={{opacity:.7, marginTop:-8}}>Sales Engineering Demo</p>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:8, margin:'6px 0 12px'}} />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:8, margin:'6px 0 12px'}} />
          <button type="submit" style={{width:'100%', padding:10, borderRadius:8}}>Login</button>
          {error && <p style={{color:'crimson'}}>{error}</p>}
          <p style={{fontSize:12, opacity:.7, marginTop:8}}>Demo: demo@demo.com / demo123</p>
        </form>
      </div>
    </div>
  )
}
