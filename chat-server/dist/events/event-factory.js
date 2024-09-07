"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const empty_event_1 = __importDefault(require("./empty-event"));
const join_event_1 = __importDefault(require("./join-event"));
const message_event_1 = __importDefault(require("./message-event"));
class ChatEventFactory {
    static CreateEvent(socket, event) {
        console.log(`New Event: 
            Event: ${JSON.stringify(event)}`);
        switch (event.actionType) {
            case 'join':
                return new join_event_1.default(socket, event);
            case 'message':
                return new message_event_1.default(socket, event);
            default:
                return new empty_event_1.default(socket, event);
        }
    }
}
exports.default = ChatEventFactory;
