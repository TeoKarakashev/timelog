import express from 'express'
import collectRouter from './routes/collect'

export const app = express()

app.use(express.json())
app.use('/collect', collectRouter)
