import express from 'express'
import session from 'express-session'

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

app.get('/', (request, response)=>{
response.render('frontpage')
    
})

// middleware der fanger resterende requests
app.use((request, response, next)=>{
    response.status(404).send('404 - Du tabte')
})

app.listen(8000, ()=>{
    console.log("🚅 nu kører toget")
})