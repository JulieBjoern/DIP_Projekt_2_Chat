
class Chat {
    static id = 1; 

    constructor(name, ownerId) {
        this.id = Chat.id++;
        this.name = name;
        this.ownerId = ownerId;
        this.createdAt = new Date().toISOString();
        this.messages = []; 
    }
}
