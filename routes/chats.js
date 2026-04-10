import express from 'express'
import ChatController from '../controller/chatcontroller.js'
import userRouter, { requiredLevel } from './userRouter.js';

const chatRouter = express.Router()

chatRouter.get('/addchat', (request, response)=>{
    response.render('createChat')
})

chatRouter.post('/addchat',requiredLevel(2), async (request, response) => {
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
    response.render('specificChat', { chat, messages,
    userLevel: request.session.userLevel
    });
})

chatRouter.delete('/:id/messages/:messageId',requiredLevel(2), async (request, response) => {
    const chatId = Number(request.params.id)
    const messageId = Number(request.params.messageId)

    const deletedMessage = await ChatController.deleteMessage(chatId, messageId)

    if (!deletedMessage) {
        return response.status(404).json({ message: 'Besked ikke fundet' })
    }

    response.json({ message: 'Besked slettet' })
})

// Slet en chat
chatRouter.delete('/:id',requiredLevel(2), async (request, response) => {
    const chatId = Number(request.params.id)
    const userLevel = request.session.userLevel || 0
    const userId = request.session.userId || 0

    const chat = ChatController.getChatById(chatId)

    if (!chat) {
        return response.status(404).json({ message: 'Chat ikke fundet' })
    }

    // Niveau 2: kan kun slette egne chats
    // Niveau 3: kan slette alle chats
    if (userLevel === 2 && chat.ownerId !== userId) {
        return response.status(403).json({ message: 'Du har ikke adgang til at slette denne chat' })
    }

    if (userLevel < 2) {
        return response.status(403).json({ message: 'Du har ikke adgang til at slette chats' })
    }

    await ChatController.deleteChat(chatId)
    response.json({ message: 'Chat slettet' })
})

// Rediger en chat
chatRouter.put('/:id',requiredLevel(2), async (request, response) => {
    const chatId = Number(request.params.id)
    const { name } = request.body
    const userLevel = request.session.userLevel || 0
    const userId = request.session.userId || 0

    const chat = ChatController.getChatById(chatId)

    if (!chat) {
        return response.status(404).json({ message: 'Chat ikke fundet' })
    }

    // Niveau 2: kan kun redigere egne chats
    // Niveau 3: kan redigere alle chats
    if (userLevel === 2 && chat.ownerId !== userId) {
        return response.status(403).json({ message: 'Du har ikke adgang til at redigere denne chat' })
    }

    if (userLevel < 2) {
        return response.status(403).json({ message: 'Du har ikke adgang til at redigere chats' })
    }

    await ChatController.updateChat(chatId, name.trim(), chat.ownerId)
    response.json({ message: 'Chat opdateret' })
})

export default chatRouter