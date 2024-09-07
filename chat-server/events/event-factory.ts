import EmptyEvent from "./empty-event";
import ChatEvent from "./event";
import JoinEvent from "./join-event";
import MessageEvent from "./message-event";

export default class ChatEventFactory{
    static CreateEvent(socket: any, event: ChatEvent){
        console.log(`New Event: 
            Event: ${JSON.stringify(event)}`);

        switch(event.actionType){
            case 'join':
                return new JoinEvent(socket, event);
            case 'message':
                return new MessageEvent(socket, event);
            default:
                return new EmptyEvent(socket, event);
        }
    }
}