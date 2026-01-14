import { app } from './app'

const PORT = 4000

app.listen(PORT, () => {
  console.log(`Storage service running on port ${PORT}`)
})
