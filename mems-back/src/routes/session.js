import express from 'express'
import bcrypt from 'bcryptjs'

import { User } from '../database.js'

const router = express.Router()

router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: 'Not an authorized user' })
    }

    const user = req.session.user
    res.json({
        user: {
            login: user.login,
            admin: user.admin
        }
    })
})

router.post('/', async (req, res) => {
    const login = req.body.login.trim()
    if (!login) {
        return res.status(401).json({ error: "Login can't be empty" })
    }

    const password = req.body.password.trim()
    if (!password) {
        return res.status(401).json({ error: "Password can't be empty" })
    }

    try {
        const user = await User.findOne({ where: { login }})
        if (!(user && bcrypt.compareSync(password, user.password))) {
            return res.status(401).json({ error: 'Login or password is incorrect' })
        }

        req.session.user = user

        res.json({
            user: {
                login: user.login,
                admin: user.admin
            }
        })
    } catch (error) {
        console.error(error)

        return res.status(503).end()
    }
})

router.delete('/', (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: 'Not an authorized user' })
    }

    req.session.regenerate(() => {
        res.status(204).end()
    })
})

export default router
