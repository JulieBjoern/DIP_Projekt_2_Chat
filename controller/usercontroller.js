import User from "../model/user.js"
import Archive from '../archive.js'

class UserController {
    static users = [new User('ole', '123', 0)]

    static async addUser(username, password, level){
        const newUser = new User(username, password, level)
        UserController.users.push(newUser)
        if(level <= 3 && level> 0){
        await Archive.writeFile('data/users.json', JSON.stringify(UserController.users))
        }
        return newUser
    }

    static async startUp(){
        let data = await Archive.readFile('data/users.json')
        if (data){
            UserController.users = JSON.parse(data)
            const biggestID = UserController.users.reduce((accumulator, user) => {
                return user.id >= accumulator ? user.id : accumulator
            },0)
            User.id = biggestID + 1
        }
    }

    // metode til at hente en specifik user
    static getUserById(id) {    
        return UserController.users.find(user => user.id === id);
    }

     // metode til at hente alle users
    static getAllUsers() {
        return UserController.users;
    }
   
static getUser(username, password) {
  
    return this.users.find(u => u.username === username && u.password === password);
}
}

export default UserController
