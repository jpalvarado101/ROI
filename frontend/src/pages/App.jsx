
import React, { useState } from 'react'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'

export default function App(){
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  if(!token){
    return <Login onSuccess={(t,u)=>{setToken(t); setUser(u)}} />
  }
  return <Dashboard token={token} user={user} onLogout={()=>{setToken(null); setUser(null)}} />
}
