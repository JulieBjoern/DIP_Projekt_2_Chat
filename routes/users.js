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
        const {username, password, level} = request.body
        await UserController.addUser(username, password, level)
        const userLevel = parseInt(request.body.level);
        if (userLevel >= 1 && userLevel <= 3) {
        request.session.userLevel = userLevel;
        response.redirect('/');
    }
})

export default userRouter