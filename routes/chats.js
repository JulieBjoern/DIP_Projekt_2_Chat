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

    const message = await ChatController.createMessage(chatId, text.trim(), ownerId)

    if (!message) {
        return response.status(404).json({ message: 'Chat ikke fundet' })
    }

    response.status(201).json(message) // 201 = Created, alt er gået godt og der er oprettet en ressource (besked)
})

// specifik chat side 
chatRouter.get('/chat/:id/messages', (request, response) => {
    const id = Number(request.params.id)
    const chat = ChatController.getChatById(id)

    if (!chat) {
        return response.status(404).send('404 - Du tabte')
    }

    const messages = ChatController.getMessagesByChatId(id) || []
    response.render('specificChat', { chat, messages })
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