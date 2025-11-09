
import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function ROIChart({ data }){
  const compact = data.map(d => ({...d, d: d.date.slice(5)}))
  return (
    <div style={{width:'100%', height:320}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={compact}>
          <XAxis dataKey="d" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="events" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
