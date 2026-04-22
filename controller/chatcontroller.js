
import Chat from '../model/chat.js';
import Message from '../model/message.js';
import Archive from '../archive.js';

const chats_File = 'data/chats.json';

class ChatController {
    static chats = [];

    static async startUp() {
        const data = await Archive.readFile(chats_File);

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
    static async createMessage(chatId, text, ownerId) {
        const chat = ChatController.getChatById(chatId);
        if (!chat) return null;

        const newMessage = new Message(text, ownerId, chatId);
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
    static async updateMessage(chatId, messageId, text, ownerId) {
        const message = ChatController.getMessageById(chatId, messageId);
        if (!message) return null;
        message.text = text;
        message.ownerId = ownerId;
        await ChatController.saveChats();
        return message;
    }


    // metode til at slette en besked i en chat
    static async deleteMessage(chatId, messageId) {
        const chat = ChatController.getChatById(chatId);
        if (!chat) return null;
        const messageToDelete = chat.messages.find((message) => message.id === messageId);
        if (!messageToDelete) return null;

        chat.messages = chat.messages.filter(m => m.id !== messageId); // .filter bruges her til at lave en ny array uden den besked vi vil slette, og så overskriver vi den gamle array med den nye
        await ChatController.saveChats();
        return messageToDelete;
    }

    // metode til at hente alle beskeder fra en specifik bruger på tværs af alle chats
    static getMessagesBySenderId(senderId) {
        const messages = [];
        ChatController.chats.forEach(chat => {
            const userMessages = (chat.messages || []).filter(message => message.ownerId === senderId);
            messages.push(...userMessages); // her bruger vi spread operatoren (...) til at tilføje alle beskeder fra userMessages ind i vores messages array. Hvis vi bare brugte messages.push(userMessages), ville vi få et array af arrays, fordi userMessages selv er en array. Ved at bruge spread operatoren, "spreader" vi indholdet af userMessages ud i messages arrayet, så det bliver en flad liste af beskeder i stedet for en liste af lister.
        });
        return messages; 
    }
}




export default ChatController