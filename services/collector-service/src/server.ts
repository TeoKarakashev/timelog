import { app } from './app'

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Collector service running on port ${PORT}`)
})
