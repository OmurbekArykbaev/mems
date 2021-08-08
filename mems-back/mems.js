import dotenv  from 'dotenv'
dotenv.config()

import server   from './src/server.js'
import database from './src/database.js'

import sessionRoutes  from './src/routes/session.js'
import usersRoutes    from './src/routes/users.js'
import messagesRoutes from './src/routes/messages.js'

const host = process.env.MEMS_HOST || 'localhost'
const port = process.env.MEMS_PORT || 8080
const restartDelay = parseInt(process.env.MEMS_RESTART_DELAY || '3')

server.use('/session',  sessionRoutes)
server.use('/users',    usersRoutes)
server.use('/messages', messagesRoutes);

(function start() {
    setTimeout(async () => {
        try {
            await database()

            server.listen(port, host, () => {
                console.log(`mems server is listening at http://${host}:${port}`)
            })
        } catch (error) {
            console.error(error)
            console.log(`Something went wrong, trying to restart the server in ${restartDelay} seconds`)

            start()
        }
    }, restartDelay * 1000)
})()
