"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../database/db");
const jsonParser_1 = __importDefault(require("../jsonParser"));
const chat_room_1 = require("../rooms/chat-room");
class MessageEvent {
    constructor(socket, event) {
        this.socket = socket;
        this.chatId = event.chatId;
        this.actionType = event.actionType;
        this.data = (0, jsonParser_1.default)(JSON.stringify(event.data));
    }
    execute(u) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.sender = u._id.toString();
            const isUserInConversation = yield (0, db_1.IsUserInConversation)(this.chatId, this.data.sender);
            if (isUserInConversation) {
                const message = yield (0, db_1.SendMessage)(this);
                message.incoming = false;
                const response = {
                    messages: [
                        message
                    ]
                };
                chat_room_1.Chatrooms.sendMessage(this.chatId, response);
            }
        });
    }
}
exports.default = MessageEvent;
