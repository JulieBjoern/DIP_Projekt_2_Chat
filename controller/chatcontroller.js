
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Archive from '../models/Archive.js';

const chats_File = '../data/chats.json';

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

        ChatController.chats = JSON.parse(data);

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
    
    static async saveChats() {
        await Archive.writeFile(chats_File, JSON.stringify(ChatController.chats, null, 2));
    }   

    // chat crud:





    // message crud:







    // alle beskeder fra en specifik bruger på tværs af alle chats:





}


    