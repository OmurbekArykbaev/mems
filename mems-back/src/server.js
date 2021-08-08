import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'

import dotenv  from 'dotenv'
dotenv.config()

import { sessionDB } from './database.js'

if (!process.env.MEMS_SESSION_SECRET) {
    throw new Error('MEMS_SESSION_SECRET environment variable is not set')
}

const server = express()
server.use(express.static('public'))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

const RedisStore = connectRedis(session)
server.use(session({
    store: new RedisStore({ client: sessionDB }),
    secret: process.env.MEMS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

export default server
