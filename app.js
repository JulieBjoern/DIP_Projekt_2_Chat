import express from 'express'
import session from 'express-session'
import userRouter from './routes/users.js'
import ChatController from './controller/chatcontroller.js'

// start serveren op og indlæs eksisterende data
ChatController.startUp()


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
app.use('/users', userRouter)


// chat router 


app.get('/', (request, response)=>{
    const isItAValidUser = request.session.isItAValidUser
        response.render('frontpage', {isItAValidUser, chats: ChatController.getAllChats()}) // her sender vi også alle chats med til vores frontpage, så vi kan vise dem der
    }
)
response.render('frontpage')


app.use('/users', userRouter)

// middleware der fanger resterende requests
app.use((request, response, next)=>{
    response.status(404).send('404 - Du tabte')
})

app.listen(8000, ()=>{
    console.log("🚅 nu kører toget")
})