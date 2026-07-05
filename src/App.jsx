import { Routes, Route } from 'react-router-dom'
import Map from './sites/Map.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<Map />} />
    </Routes>
  )
}
