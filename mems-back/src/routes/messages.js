import express from 'express'

import { Message, User } from '../database.js'

const router = express.Router()

router.get('/', async (_, res) => {
    try {
        const messages = await Message.findAll({
            include: [{ model: User }]
        })
        res.json(messages.map(message => {
            return {
                id:        message.id,
                content:   message.content,
                createdAt: message.createdAt,
                user: {
                    id:    message.user.id,
                    login: message.user.login
                }
            }
        }))
    } catch (error) {
        console.error(error)

        return res.status(503).end()
    }
})

router.get('/:id', async (_, res) => {
    try {
        const message = await Message.findOne({
            where: { id },
            include: [{ model: User }]
        })
        res.json({
            id:        message.id,
            content:   message.content,
            createdAt: message.createdAt,
            user: {
                id:    message.user.id,
                login: message.user.login
            }
        })
    } catch (error) {
        console.error(error)

        return res.status(503).end()
    }
})

router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: "Unauthorized users can't post messages" })
    }

    const userId = req.session.user.id
    if (!userId) {
        return res.status(503).json({ error: 'Internal data inconsistency' })
    }

    const content = req.body.content.trim()
    if (!content) {
        return res.status(400).json({ error: "Message can't be empty" })
    }

    try {
        const message = await Message.create({ userId, content })
        res.status(201).json({
            message: {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
                user: {
                    id: userId,
                    login: req.session.user.login
                }
            }
        })
    } catch(error) {
        console.error(error)

        return res.status(503).end()
    }
})

router.delete('/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: "Unauthorized users can't delete messages" })
    }

    const id = req.params.id
    if (!id) {
        return res.status(400).json({ error: 'ID of the message must be specified' })
    }

    const userId = req.session.user.id
    if (!userId) {
        return res.status(503).json({ error: 'Internal data inconsistency' })
    }

    const admin = req.session.user.admin
    
    try {
        const affectedRows = await Message.destroy(
            admin ? { where: { id } } : { where: { id, userId }}
        )
        if (affectedRows === 0) {
            return res.status(403).json({ error: 'Something went wrong' })
        }

        res.status(204).end()
    } catch(error) {
        console.error(error)

        return res.status(503).end()
    }
})

router.put('/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ error: "Unauthorized users can't edit messages" })
    }

    const id = req.params.id
    if (!id) {
        return res.status(400).json({ error: 'ID of the message must be specified' })
    }

    const userId = req.session.user.id
    if (!userId) {
        return res.status(503).json({ error: 'Internal data inconsistency' })
    }

    const admin = req.session.user.admin
    if (!admin) {
        return res.status(503).json({ error: 'Internal data inconsistency' })
    }

    const content = req.body.content.trim()
    if (!content) {
        return res.status(400).json({ error: "Message can't be empty" })
    }

    try {
        const [ affectedRows ] = await Message.update(
            { content }, admin ? { where: { id } } : { where: { id, userId }}
        )
        if (affectedRows === 0) {
            return res.status(403).json({ error: 'Something went wrong' })
        }

        const message = await Message.findOne({ where: { id } })
        res.json({
            message: {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
                user: {
                    id: userId,
                    login: req.session.user.login
                }
            }
        })
    } catch(error) {
        console.error(error)
        
        return res.status(503).end()
    }
})

export default router
