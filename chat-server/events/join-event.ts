import { CreateConversation, GetConversation, GetConversationMessages, GetConversationUsers, IsUserInConversation, JoinConversation } from "../database/db";
import parse from "../jsonParser";
import { Chatrooms } from "../rooms/chat-room";
import ChatEvent, { JoinEventData } from "./event";


export default class JoinEvent implements ChatEvent{
    chatId: string;
    actionType: string;
    socket: WebSocket;
    data: JoinEventData;

    constructor(socket: WebSocket, event: ChatEvent){
        this.socket = socket;
        this.chatId = event.chatId;
        this.actionType = event.actionType;
        this.data = parse<JoinEventData>(JSON.stringify(event.data));
    }

    async execute(u: any){
        this.data.sender = u._id.toString();
        const isUserInConversation =  await IsUserInConversation(this.chatId, this.data.sender)
        if(!this.chatId && this.data.participants){
            return CreateConversation(this);
        } else if(this.chatId && await IsUserInConversation(this.chatId, this.data.sender)){
            const userList = await GetConversationUsers(this.chatId);
            const messages = await GetConversationMessages(this.chatId, this.data.sender);

            const responseObject = {
                usersList: userList,
                messages: messages
            }

            console.log(`user: ${this.data.sender}`);

            Chatrooms.joinRoom(this.chatId, this.data.sender, this.socket, responseObject);
        } else {
            await JoinConversation(this.chatId, this.data.sender);
        }
    }
}