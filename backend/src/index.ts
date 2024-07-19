import express from 'express'
import type { Request, Response } from 'express'
import {createServer} from 'http'
import SocketServer from './Socket'

const PORT = 3000
const app = express()

const httpServer = createServer(app)
const socketServer = new SocketServer(httpServer)


app.get('/', (request: Request, response: Response) => {
    response.send('Hello world')
})

httpServer.listen(PORT, () => {
    console.log(`Server is working at http://localhost:${PORT}`)
})