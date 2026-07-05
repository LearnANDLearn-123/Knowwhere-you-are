import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }
    const result = await pool.query(
      'INSERT INTO inquiries (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    )
    res.status(201).json({ inquiry: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
