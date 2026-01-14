import { Router, Request, Response } from 'express'
import { pool } from '../db'
import { sendToStorageService } from '../rpc/storageClient'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const { from, to } = req.query

  if (!from || !to) {
    return res.status(400).json({
      error: 'from and to query parameters are required'
    })
  }

  const result = await pool.query(
    `
    SELECT
      u.first_name,
      u.last_name,
      u.email,
      p.name AS project,
      t.work_date,
      t.hours
    FROM time_logs t
    JOIN users u ON u.id = t.user_id
    JOIN projects p ON p.id = t.project_id
    WHERE t.work_date BETWEEN $1 AND $2
    ORDER BY t.work_date ASC
    `,
    [from, to]
  )

  await sendToStorageService(result.rows)

  res.json({
    status: 'ok',
    recordsSent: result.rowCount
  })
})

export default router
