import { Router, Request, Response } from 'express'
import { pool } from '../db'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { jsonrpc, method, params, id } = req.body ?? {}

  if (jsonrpc !== '2.0' || method !== 'storeLogs') {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32601, message: 'Method not found' },
      id: id ?? null
    })
  }

  const logs = params?.logs

  if (!Array.isArray(logs)) {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32602, message: 'Invalid params' },
      id: id ?? null
    })
  }

  const orderedLogs = logs
    .slice()
    .sort(
      (a, b) =>
        new Date(a.work_date).getTime() - new Date(b.work_date).getTime()
    )

  const client = await pool.connect()

  try {
    await client.query('BEGIN')


    await client.query(
      `INSERT INTO collected_logs (payload) VALUES ($1)`,
      [JSON.stringify(orderedLogs)]
    )

    await client.query('COMMIT')

    return res.json({
      jsonrpc: '2.0',
      result: { stored: orderedLogs.length },
      id
    })
  } catch (error) {
    await client.query('ROLLBACK')

    console.error('Failed to store logs:', error)

    return res.status(500).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Failed to store logs' },
      id: id ?? null
    })
  } finally {
    client.release()
  }
})

export default router
