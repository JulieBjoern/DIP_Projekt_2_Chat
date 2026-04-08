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

export default chatRouter