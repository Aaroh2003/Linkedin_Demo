import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})


