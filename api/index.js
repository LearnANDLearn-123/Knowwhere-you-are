import express from 'express'
import cors from 'cors'
import authRoutes from '../server/routes/auth.js'
import commissionRoutes from '../server/routes/commissions.js'
import inquiryRoutes from '../server/routes/inquiries.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/commissions', commissionRoutes)
app.use('/api/inquiries', inquiryRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
