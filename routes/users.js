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

// liste af users router
userRouter.get('/users',(requiredLevel(2)), (request, response)=>{
    response.render('userList', {users: UserController.getAllUsers()})
})

// specifik user router
userRouter.get('/users/:id',(request,response)=>{
    const userId = Number(request.params.id)
    const user = UserController.getUserById(userId)
    response.render('specificUser',{user})
})

export default userRouter