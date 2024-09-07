let instance: Chatroom;
let rooms = [] as {
    chatId: string,
    title?: string,
    users: Map<string, WebSocket>
}[];

class Chatroom {
    constructor() {
        if (instance) {
            throw new Error("You can only create one instance!");
        }
        instance = this;
    }

    joinRoom(chatId: string, userId: string, socket: WebSocket, response: any){
        let chatRoom = rooms.findIndex(room => room.chatId == chatId);
        if(chatRoom == -1){      
            rooms.push({
                chatId: chatId,
                users: new Map<string, WebSocket>()
            })

            chatRoom = rooms.length - 1;
        }

        rooms[chatRoom].users.set(userId, socket);

        socket.send(JSON.stringify(response));
    }

    sendMessage(chatId: string, message: any){
        let chatRoom = rooms.findIndex(room => room.chatId == chatId);
        if(chatRoom == -1){
            return;
        }

        for(const [userId, socket] of rooms[chatRoom].users.entries()){
            let { messages } = message;
            messages = messages.map((message: any)=>{
                message.incoming = message.sender != userId;
                return message;
            })

            message.messages = messages;

            console.log(message);

            socket.send(JSON.stringify(message));
        }
    }
}

export const Chatrooms = Object.freeze(new Chatroom())