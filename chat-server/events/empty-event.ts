import ChatEvent from "./event";

export default class EmptyEvent implements ChatEvent {
    chatId: string;
    socket: WebSocket
    actionType: string;
    data: string;

    constructor(socket: WebSocket, event: ChatEvent){
        this.socket = socket;
        this.chatId = event.chatId;
        this.actionType = event.actionType;
        this.data = event.data;
    }

    execute(u: any){}
}