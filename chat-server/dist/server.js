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
const ws_1 = require("ws");
const db_1 = require("./database/db");
const jsonParser_1 = __importDefault(require("./jsonParser"));
const event_factory_1 = __importDefault(require("./events/event-factory"));
const wss = new ws_1.WebSocketServer({ port: 1324, host: 'localhost' });
wss.on('listening', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('started listening on: ' + JSON.stringify(wss.address()));
}));
wss.on('connection', (socket, request) => __awaiter(void 0, void 0, void 0, function* () {
    //authenticate user
    const user = yield AuthenticateConnection(request);
    if (!user) {
        socket.close(3000, "Unable to authenticate user");
        return;
    }
    socket.on('message', (data, binary) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(JSON.stringify(user));
            const eventObj = (0, jsonParser_1.default)(data.toString());
            const event = event_factory_1.default.CreateEvent(socket, eventObj);
            yield event.execute(user);
        }
        catch (e) {
            console.log('ERROR: ' + e);
        }
    }));
    socket.on('close', () => {
    });
}));
function AuthenticateConnection(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookiePos = request.rawHeaders.findIndex((value, index, obj) => value === "Cookie");
        if (!cookiePos || cookiePos == -1) {
            return null;
        }
        const cookieString = request.rawHeaders[cookiePos + 1];
        const sessionId = getCookieValue(cookieString, 'authjs.session-token');
        const session = yield (0, db_1.GetSessionInformation)(sessionId);
        if (!session || !session) {
            return null;
        }
        const appAccount = yield (0, db_1.GetAppAccount)(session.userId.toString());
        return appAccount;
    });
}
function getCookieValue(cookieString, cookieKey) {
    const cookies = cookieString.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === cookieKey) {
            return value;
        }
    }
    return "";
}
