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
exports.GetSessionInformation = GetSessionInformation;
exports.GetAppAccount = GetAppAccount;
exports.GetUserConversations = GetUserConversations;
exports.GetConversationMessages = GetConversationMessages;
exports.GetConversation = GetConversation;
exports.CreateConversation = CreateConversation;
exports.IsUserInConversation = IsUserInConversation;
exports.JoinConversation = JoinConversation;
exports.GetConversationUsers = GetConversationUsers;
exports.SendMessage = SendMessage;
const dbClient_1 = __importDefault(require("./dbClient"));
const mongodb_1 = require("mongodb");
function GetSessionInformation(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const result = yield db.collection("sessions")
                .findOne({ sessionToken: sessionId.toString() });
            return result;
        }
        catch (e) {
            console.log(e);
        }
    });
}
function GetAppAccount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const result = yield db.collection("AppAccounts")
                .findOne({ oAuthId: userId });
            return result;
        }
        catch (e) {
            console.log(e);
        }
    });
}
function GetUserConversations(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const result = yield db.collection("ConversationUsers")
                .findOne({ userId: userId });
            return result;
        }
        catch (e) {
            console.log(e);
        }
    });
}
function GetConversationMessages(chatId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const query = yield db.collection("ConversationMessages")
                .find({ chatId: chatId });
            let result = [];
            while (yield query.hasNext()) {
                const next = yield query.next();
                next.incoming = next.sender != userId;
                result.push(next);
            }
            return result;
        }
        catch (e) {
            console.log(e);
        }
    });
}
function GetConversation(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const result = yield db.collection("Conversation")
                .findOne({ _id: new mongodb_1.ObjectId(chatId) });
            return result === null || result === void 0 ? void 0 : result._id.toString();
        }
        catch (e) {
            console.log(e);
        }
    });
}
function CreateConversation(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const conversation = {
                chatTitle: event.data.title
            };
            const result = yield db.collection("Conversation")
                .insertOne(conversation);
            [event.data.sender, ...event.data.participants || []]
                .filter(user => user != "")
                .map((user) => __awaiter(this, void 0, void 0, function* () {
                const conversationUser = {
                    chatId: result.insertedId.toString(),
                    userId: user
                };
                yield db.collection("ConversationUsers")
                    .insertOne(conversationUser);
            }));
            return result.insertedId.toString();
        }
        catch (e) {
            console.log(e);
        }
    });
}
function IsUserInConversation(chatId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const result = yield db.collection("ConversationUsers")
                .findOne({ userId: userId, chatId: chatId });
            return result != null;
        }
        catch (e) {
            console.log(e);
        }
    });
}
function JoinConversation(chatId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const result = yield db.collection("ConversationUsers")
                .insertOne({ userId: userId, chatId: chatId });
            return result;
        }
        catch (e) {
            console.log(e);
        }
    });
}
function GetConversationUsers(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const query = yield db.collection("ConversationUsers")
                .find({ chatId: chatId });
            let results = [];
            while (yield query.hasNext()) {
                const temp = yield query.next();
                const result = yield db.collection("AppAccounts")
                    .findOne({ _id: new mongodb_1.ObjectId(temp.userId) });
                results.push(result);
            }
            return results;
        }
        catch (e) {
            console.log(e);
        }
    });
}
function SendMessage(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield dbClient_1.default;
            const db = client.db("RemoteFlow_Db");
            const message = {
                chatId: event.chatId,
                sender: event.data.sender,
                timestamp: event.data.timestamp,
                message: event.data.message
            };
            const result = yield db.collection("ConversationMessages")
                .insertOne(message);
            return yield db.collection("ConversationMessages")
                .findOne({ _id: result.insertedId });
        }
        catch (e) {
            console.log(e);
        }
    });
}
