import express, { request, response } from 'express'
import UserController from '../controller/usercontroller.js'

const userRouter = express.Router()


userRouter.get('/adduser',(request,response)=>{
response.render('createUser')
});

userRouter.post('/adduser', async (request, response)=>{
        const {username, password} = request.body
        UserController.addUser(username, password)
        response.redirect('/')

        
})

export default userRouter