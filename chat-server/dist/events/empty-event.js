"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmptyEvent {
    constructor(socket, event) {
        this.socket = socket;
        this.chatId = event.chatId;
        this.actionType = event.actionType;
        this.data = event.data;
    }
    execute(u) { }
}
exports.default = EmptyEvent;
