"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatrooms = void 0;
let instance;
let rooms = [];
class Chatroom {
    constructor() {
        if (instance) {
            throw new Error("You can only create one instance!");
        }
        instance = this;
    }
    joinRoom(chatId, userId, socket, response) {
        let chatRoom = rooms.findIndex(room => room.chatId == chatId);
        if (chatRoom == -1) {
            rooms.push({
                chatId: chatId,
                users: new Map()
            });
            chatRoom = rooms.length - 1;
        }
        rooms[chatRoom].users.set(userId, socket);
        socket.send(JSON.stringify(response));
    }
    sendMessage(chatId, message) {
        let chatRoom = rooms.findIndex(room => room.chatId == chatId);
        if (chatRoom == -1) {
            return;
        }
        for (const [userId, socket] of rooms[chatRoom].users.entries()) {
            let { messages } = message;
            messages = messages.map((message) => {
                message.incoming = message.sender != userId;
                return message;
            });
            message.messages = messages;
            console.log(message);
            socket.send(JSON.stringify(message));
        }
    }
}
exports.Chatrooms = Object.freeze(new Chatroom());
