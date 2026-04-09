import express, { request } from 'express'
import UserController from '../controller/usercontroller.js'
import ChatController from '../controller/chatcontroller.js'

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
        const userLevel = parseInt(level);
        if (userLevel >= 1 && userLevel <= 3) {
    request.session.userName = username;
        request.session.userLevel = userLevel;

      request.session.save(() => {
        response.redirect('/');
    })
    }
})

userRouter.get('/:id/messages', (req, res) => {
    const userId = Number(req.params.id);
    const user = UserController.getUserById(userId);
    const messages = ChatController.getMessagesBySenderId(userId);

    // Hent alle chats som disse beskeder tilhører
    const chats = messages.map(msg => {
        return ChatController.getChatById(msg.chatId);
    });

    res.render('userMessages', {
        user,
        messages,
        chats
    });
});


// liste af users router
userRouter.get('/', (request, response)=>{
    response.render('userList', {users: UserController.getAllUsers()})
})

// specifik user router
userRouter.get('/:id',(request,response)=>{
    const userId = Number(request.params.id)
    const user = UserController.getUserById(userId)
    response.render('specificUser',{user, title: 'Specifik User'})
})

export default userRouter