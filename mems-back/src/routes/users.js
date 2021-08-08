import express from 'express'
import bcrypt from 'bcryptjs'
import validator from 'validator'

import { User } from '../database.js'

const router = express.Router()

router.post('/', async (req, res) => {
    const login = req.body.login.trim()
    if (!login) {
        return res.status(400).json({ error: "Login can't be empty" })
    }

    let password = req.body.password.trim()
    if (!password) {
        return res.status(400).json({ error: "Password can't be empty" })
    }

    const passwordRepeat = req.body.passwordRepeat.trim()
    if (!passwordRepeat) {
        return res.status(400).json({ error: "Repeated password can't be empty" })
    }
    
    if (password !== passwordRepeat) {
        return res.status(400).json({ error: 'The password was not repeated correctly' })
    }

    if (!validator.isStrongPassword(password)) {
        const error =
            'The password is too simple. The password must have at least ' +
            'one number, one symbol, one lower case and one upper case '   +
            'letter with at least 8 characters in total.'

        return res.status(400).json({ error })
    }

    try {
        let user = await User.findOne({ where: { login }})
        if (user) {
            return res.status(400).json({ error: 'The user name is invalid. Try a different one.' })
        }

        const saltRounds = parseInt(process.env.MEMS_PASS_SALT_ROUNDS || '8')
        password = bcrypt.hashSync(password, saltRounds)
        user = await User.create({ login, password })

        req.session.user = user

        res.json({
            user: {
                login: user.login,
                admin: false
            }
        })
    } catch (error) {
        console.error(error)

        return res.status(503).end()
    }
})

export default router
