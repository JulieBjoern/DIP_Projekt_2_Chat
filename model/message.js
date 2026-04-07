
class Message {
    static id = 1;

    constructor(text, ownerId, chatId) {
        this.id = Message.id++;
        this.text = text;
        this.ownerId = ownerId;
        this.chatId = chatId;
        this.createdAt = new Date().toISOString();
    }
}

export default Message;