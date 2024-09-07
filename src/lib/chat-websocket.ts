import { Dispatch, SetStateAction } from "react";
import { AppAccount, ConversationMessage, MessageEvent } from "@/lib/definitions";
import parseJson from "@/components/json/parser";

export default function openChatWebSocket(chatId: string, setSentMessages: Dispatch<SetStateAction<ConversationMessage[]>>, setUserList: Dispatch<SetStateAction<AppAccount[]>>){
    const ws = new WebSocket("ws://localhost:1324");

    ws.onopen = (event)=>{
        const message = {
            chatId,
            actionType: 'join',
            data: {
                participants: [''],
                title: 'mock test ' + Math.random()
            }
        }
        setTimeout(()=>{
            ws.send(JSON.stringify(message));
        }, 1000);
    }

    ws.onmessage = ((ev)=>{
        console.log(ev);
        handleEvent(ev, setSentMessages, setUserList);
    });

    const cleanup = () => {
        if (ws) {
            ws.close();
        }
    };

    return {
        cleanup, 
        ws
    };
}

function handleEvent(event: globalThis.MessageEvent<any>, setSentMessages: Dispatch<SetStateAction<ConversationMessage[]>>, setUserList: Dispatch<SetStateAction<AppAccount[]>>){
    const data = parseJson<{
        usersList?: AppAccount[],
        messages?: ConversationMessage[]
    }>(event.data);

    if(data.messages){
        let messages = data.messages as ConversationMessage[];
        setSentMessages((prevVal: ConversationMessage[]) => ([...prevVal, ...messages]));
    }

    if(data.usersList){
        let usersList = data.usersList as AppAccount[];
        setUserList(usersList);
    }
}