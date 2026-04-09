import express from 'express'
import UserController from '../controller/usercontroller.js'

const userRouter = express.Router()


// ROUTES for login 
userRouter.get('/login', (request, response)=>{
    response.render('login', {})
})

userRouter.post('/login', (request, response)=>{
    const {username, password} = request.body
        response.render('frontpage')
})
userRouter.get('/adduser',(request,response)=>{
response.render('createUser')
});

userRouter.post('/adduser', async (request, response)=>{
        const {username, password} = request.body
        await UserController.addUser(username, password)
        response.redirect('/')
})

export default userRouter