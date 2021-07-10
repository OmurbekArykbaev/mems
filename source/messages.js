function messages(app, messageModel, userModel) {
    app.get('/messages', async (_, res) => {
        try {
            const messages = await messageModel.findAll({ include: [ { model: userModel } ]})
            res.json(messages.map(message => {
                return {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    user: {
                        id: message.user.id,
                        login: message.user.login
                    }
                }
            }))
        } catch(error) {
            console.error(error)
            return res.status(503).end()
        }
    })

    app.post('/create-message', async (req, res) => {
        if (!req.session.user) {
            return app.handleError(res, 403, "Unauthorized users can't post messages")
        }

        const userId = req.session.user.id
        const content = req.body.content.trim()
        if (!content) {
            return app.handleError(res, 400, "Message can't be empty")
        }

        try {
            const message = await messageModel.create({ userId, content })

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

    /*

    app.post('/delete-message/:id', (request, response) => {
        const id = request.params.id
        const userID = request.session.id

        Message.destroy({ where: {
            id, userID
        }}).then(affectedRows => {
            if (affectedRows === 0) {
                return response.status(403).end()
            }
            response.redirect('/')
        }).catch(error => {
            console.error(error)
            return response.status(503).end()
        })
    })

    app.post('/edit-message/:id', (request, response) => {
        const id = request.params.id
        const userID = request.session.id

        const name = request.body.name
        if (!validateName(name, request, response, `/edit-message/${id}`)) return

        const content = request.body.content
        if (!validateContent(content, request, response, `/edit-message/${id}`)) return

        Message.update({ name, content }, { where: { id, userID }}).then(result => {
            const affectedRows = result[0]
            if (affectedRows === 0) {
                return response.status(403).end()
            }
            response.redirect('/')
        }).catch(error => {
            console.error(error)
            return response.status(503).end()
        })
    })

    */
}

export default messages