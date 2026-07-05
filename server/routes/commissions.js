import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, map_type, scale, description } = req.body
    if (!title || !map_type) {
      return res.status(400).json({ error: 'Title and map type are required' })
    }
    const result = await pool.query(
      'INSERT INTO commissions (user_id, title, map_type, scale, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, title, map_type, scale || null, description || null]
    )
    res.status(201).json({ commission: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM commissions WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    )
    res.json({ commissions: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
