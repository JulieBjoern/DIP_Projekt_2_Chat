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


//ROUTES 

// user router til login/logout og user relaterede ting



// chat router 
app.use('/chats', chatRouter)



app.get('/', (request, response)=>{
        response.render('frontpage', {
            chats: ChatController.getAllChats(),
            userName: request.session.userName || 'du er ikke logget ind',
            isLoggedIn: Boolean(request.session.userName)
        }) // her sender vi også alle chats med til vores frontpage, så vi kan vise dem der
    }
)

// user router
app.use('/users', userRouter)



// liste af users messages
app.use('/users', userRouter)

// middleware der fanger resterende requests
app.use((request, response, next)=>{
    response.status(404).send('404 - Du tabte')
})

app.listen(8000, ()=>{
    console.log("🚅 nu kører toget")
}) 

}

startServer() 