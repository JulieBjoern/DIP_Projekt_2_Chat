import express from 'express'
import ChatController from '../controller/chatcontroller.js'

const chatRouter = express.Router()

chatRouter.get('/addchat', (request, response)=>{
    response.render('createChat')
})

chatRouter.post('/addchat', async (request, response) => {
const { name } = request.body
const ownerId = request.session.userId || 0
await ChatController.createChat(name, ownerId)
response.redirect('/')
})

chatRouter.post('/:id/messages', async (request, response) => {
    const chatId = Number(request.params.id)
    const { text } = request.body
    const ownerId = request.session.userId || 0

    if (!text || !text.trim()) {
        return response.status(400).json({ message: 'Besked mangler' })
    }

    const message = await ChatController.createMessage(chatId, text.trim(), ownerId)

    if (!message) {
        return response.status(404).json({ message: 'Chat ikke fundet' })
    }

    response.status(201).json(message)
})

chatRouter.delete('/:id/messages/:messageId', async (request, response) => {
    const chatId = Number(request.params.id)
    const messageId = Number(request.params.messageId)

    const deletedMessage = await ChatController.deleteMessage(chatId, messageId)

    if (!deletedMessage) {
        return response.status(404).json({ message: 'Besked ikke fundet' })
    }

    response.json({ message: 'Besked slettet' })
})

export default chatRouter