import { IsUserInConversation, SendMessage } from "../database/db";
import parse from "../jsonParser";
import { Chatrooms } from "../rooms/chat-room";
import ChatEvent, { JoinEventData, MessageEventData } from "./event";

export default class MessageEvent implements ChatEvent {
    chatId: string;
    actionType: string;
    socket: WebSocket;
    data: MessageEventData;

    constructor(socket: WebSocket, event: ChatEvent){
        this.socket = socket;
        this.chatId = event.chatId;
        this.actionType = event.actionType;
        this.data = parse<MessageEventData>(JSON.stringify(event.data));
    }

    async execute(u: any){
        this.data.sender = u._id.toString();
        const isUserInConversation = await IsUserInConversation(this.chatId, this.data.sender);

        if(isUserInConversation){
            const message = await SendMessage(this) as any;
            message.incoming = false;
            const response = {
                messages: [
                    message
                ]
            };

            Chatrooms.sendMessage(this.chatId, response);
        }
    }
}