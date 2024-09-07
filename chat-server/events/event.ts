import JoinEvent from "./join-event";

export default interface ChatEvent{
    chatId: string;
    actionType: string;
    socket: WebSocket;
    data: any;
    execute: (u: any)=>any;
}

export interface JoinEventData{
    participants?: string[],
    title: string, 
    sender: string
}

export interface MessageEventData{
    message: string,
    sender: string,
    timestamp: Date
}