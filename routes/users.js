import express, { request, response } from 'express'
import UserController from '../controller/usercontroller.js'

const userRouter = express.Router()


userRouter.get('/adduser',(request,response)=>{
response.render('createUser')
});

userRouter.post('/adduser', async (request, response)=>{
    if (request.session.isItAValidUser){
        const {username, password} = request.body
        UserController.addUser(username, password)
        const users = UserController.users()
        response.json({
            message: `Bruger ${username} er nu oprettet`, 
            status: 200,
        users: users
        })
    }
})

export default userRouter