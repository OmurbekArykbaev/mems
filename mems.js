import express from 'express'
import dotenv from 'dotenv'

import {User, Message, dbStart} from './source/database.js'

dotenv.config()

const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8099

app.get('/', (req, res) => {
  res.send('Hello World!')
})

dbStart()

app.listen(port, () => {
  console.log(`mems sever is listening at http://${host}:${port}`)
})