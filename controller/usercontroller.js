import User from "../model/user.js"
import Archive from '../archive.js'

class UserController {
    static users = [new User('ole', '123', 0)]

    static async addUser(username, password){
        UserController.users.push(new User(username, password))
        await Archive.writeFile('data/users.json', JSON.stringify(UserController.users))
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
}

export default UserController
