import express from 'express'
import rpcRouter from './routes/rpc'

export const app = express()

app.use(express.json())
app.use('/rpc', rpcRouter)
