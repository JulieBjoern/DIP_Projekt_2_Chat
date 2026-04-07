import express from 'express'
import UserController from '../controller/usercontroller.js'

const userRouter = express.Router()


// ROUTES for login 
userRouter.get('/login', (request, response)=>{
    response.render('login', {})
})

userRouter.post('/login', (request, response)=>{
    const {username, password} = request.body
    const isItAValidUser  = UserController.validateUser(username, password)
    if (isItAValidUser) {
        request.session.isItAValidUser = true
        request.session.userId = isItAValidUser.id
        response.render('frontpage', {isItAValidUser})
    } else {
        response.render('noAccess', {})
    }
})

export default userRouter