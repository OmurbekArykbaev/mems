import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const app = express()
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8099

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`mems sever is listening at http://${host}:${port}`)
})