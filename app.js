import express, { response } from 'express'
import session from 'express-session'
import userRouter from './routes/users.js'
import ChatController from './controller/chatcontroller.js'
import UserController from './controller/usercontroller.js'
import chatRouter from './routes/chats.js'

// luk ikke serveren før data er indlæst
async function startServer() {
    await ChatController.startUp()
    await UserController.startUp()  


const app = express()

// SETUP
app.set('view engine', 'pug')


// MIDDLEWARE
app.use(express.static('assets'))


// normal POST formulardata gjort tilgængelig
// for at kunne modtage alm data i body skal express kunne læse dette
app.use(express.urlencoded())
// for at kunne modtage JSON i body skal express kunne læse dette
app.use(express.json())
app.use(session({
    secret: 'secret@agent',
    saveUninitialized: true,
    resave: true
}))

const requiredLevel = (minLevel) => {
    return (request, response, next) => {

        if (request.session.userLevel >= minLevel) {
            return next();
        }
        if (!request.session.userLevel) {
            return response.render('login')
        }
        response.render('noAcess')
    };
};

//ROUTES 

// user router til login/logout og user relaterede ting
app.use('/users', userRouter)


// chat router 
app.use('/chats', chatRouter)

app.post('/login', (request, response) => {
      response.redirect('/')
});


app.get('/', (request, response)=>{
        response.render('frontpage', { chats: ChatController.getAllChats()}) // her sender vi også alle chats med til vores frontpage, så vi kan vise dem der
    }
)

app.use('/users', userRouter)

// specifik chat side  TODO: (!!!!!!!kan også lægges ind i chats.js routen!!!!!!)
app.get('/chat/:id/messages', (request, response) => {
    const id = Number(request.params.id)
    const chat = ChatController.getChatById(id)

    if (!chat) {
        return response.status(404).send('404 - Du tabte')
    }

    const messages = ChatController.getMessagesByChatId(id) || []
    response.render('specificChat', { chat, messages })
})

// liste af users router
app.get('/users',(requiredLevel(2)), (request, response)=>{
    response.render('userList', {users: UserController.getAllUsers()})
})

// middleware der fanger resterende requests
app.use((request, response, next)=>{
    response.status(404).send('404 - Du tabte')
})

app.listen(8000, ()=>{
    console.log("🚅 nu kører toget")
}) 

}

startServer() 