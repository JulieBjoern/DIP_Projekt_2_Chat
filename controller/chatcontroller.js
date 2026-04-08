
import Chat from '../model/chat.js';
import Message from '../model/message.js';
import Archive from '../archive.js';

const chats_File = 'data/chats.json';

class ChatController {
    static chats = [];

    static async startUp() {
        const data = await Archive.readFile(chats_File);
        console.log('Data indlæst fra chats.json:', data); // log for at se hvad der kommer ind fra filen

        if (!data) { // hvis filen ikke eksisterer eller er tom, initialiserer vi en tom liste og starter id'er på 1
            ChatController.chats = [];
            Chat.id = 1;
            Message.id = 1;
            return;
        }

        ChatController.chats = JSON.parse(data); // her gemmer vi den eksisterende data (chats.json) i vores controller

        const biggestChatId = ChatController.chats.reduce(
            (biggest, chat) => (chat.id > biggest ? chat.id : biggest),
            0
        );
        Chat.id = biggestChatId + 1;

        // find også det største message id på tværs af alle chats for at sikre, at message id'er er unikke globalt
        const biggestMessageId = ChatController.chats.reduce(
            (biggest, chat) => {
                const biggestInChat = (chat.messages || []).reduce(
                    (biggestMsg, message) => (message.id > biggestMsg ? message.id : biggestMsg),
                    0
                );
                return biggestInChat > biggest ? biggestInChat : biggest;
            },
            0
        );

        Message.id = biggestMessageId + 1;
    }
    
     

    // chat crud:

    // metode til at oprette en chat
    static async createChat(name, ownerId) {
        const newChat = new Chat(name, ownerId);
        ChatController.chats.push(newChat);
        await ChatController.saveChats();
        return newChat;
    }

    // metode til at hente alle chats
    static getAllChats() {
        return ChatController.chats;
    }

    // metode til at hente en specifik chat
    static getChatById(id) {    
        return ChatController.chats.find(chat => chat.id === id);
    }

    // metode til at opdatere en chat
    static async updateChat(id, name, ownerId) {
        const chat = ChatController.getChatById(id);
        if (!chat) return null;

        chat.name = name;
        chat.ownerId = ownerId;
        await ChatController.saveChats();
        return chat;
    }

    // metode til at slette en chat
    static async deleteChat(id) {
        ChatController.chats = ChatController.chats.filter(c => c.id !== id);
       await ChatController.saveChats();
    }

    // metode til at gemme alle chats til fil
    static async saveChats() {
        await Archive.writeFile(chats_File, JSON.stringify(ChatController.chats, null, 2));
    } 



    // message crud:

    // metode til at oprette en besked i en chat
    static async createMessage(chatId, content, senderId) {
        const chat = ChatController.getChatById(chatId);
        if (!chat) return null;

        const newMessage = new Message(content, senderId);
        chat.messages.push(newMessage);
        await ChatController.saveChats();
        return newMessage;
    }

    // metode til at hente alle beskeder i en chat
    static getMessagesByChatId(chatId) {
        const chat = ChatController.getChatById(chatId);
        return chat ? chat.messages : null;
    }

    // metode til at hente en specifik besked i en chat
    static getMessageById(chatId, messageId) {
        const chat = ChatController.getChatById(chatId);
        if (!chat) return null;
        return chat.messages.find(message => message.id === messageId);
    }

    // metode til at opdatere en besked i en chat
    static async updateMessage(chatId, messageId, content, senderId) {
        const message = ChatController.getMessageById(chatId, messageId);
        if (!message) return null;
        message.content = content;
        message.senderId = senderId;
        await ChatController.saveChats();
        return message;
    }


    // metode til at slette en besked i en chat
    static async deleteMessage(chatId, messageId) {
        const chat = ChatController.getChatById(chatId);
        if (!chat) return null;
        chat.messages = chat.messages.filter(m => m.id !== messageId); // .filter i stedet for to for-løkker. .filter er en indbygget array metode der returnerer et nyt array baseret på en betingelse. Her siger vi "returner alle beskeder hvor id ikke er lig med messageId", altså slet den besked der har det id
        await ChatController.saveChats();
    }

    // metode til at hente alle beskeder fra en specifik bruger på tværs af alle chats
    static getMessagesBySenderId(senderId) {
        const messages = [];
        ChatController.chats.forEach(chat => {
            const userMessages = (chat.messages || []).filter(message => message.senderId === senderId);
            messages.push(...userMessages);
        });
        return messages; 
    }
}




export default ChatController