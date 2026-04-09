
class User {
    static id = 1;

    constructor(username, password, level) {
        this.id = User.id++;
        this.username = username;
        this.password = password;
        this.level = level;             
        this.createdAt = new Date().toISOString();
    }
}

export default User;