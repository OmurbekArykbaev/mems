import express from 'express'
import session   from 'express-session'
import dotenv from 'dotenv'

import {User, Message, dbStart} from './source/database.js'
import users from './source/users.js'
import messages from './source/messages.js'

dotenv.config()

const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.MEMS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.handleError = (res, status, error = 'Something went wrong') => {
  return res.status(status).json({ error })
}

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8099

app.get('/', (req, res) => {
  res.send('Hello World!')
})

users(app, User)
messages(app, Message)

dbStart()

app.listen(port, () => {
  console.log(`mems sever is listening at http://${host}:${port}`)
})