'use client'

import styles from './chat.module.css';
import { useEffect, useState } from "react";
import ChatBox from "./chatbox";
import Conversation from "./chatbox-types/conversation/conversation";
import ChatList from "./chatbox-types/chat-list/chat-list";
import { ConversationDetails } from "@/lib/definitions";
import { FetchConversation } from "./actions";

export default function ChatBoxProvider(){
    const [selectedConversations, setSelectedConversation] = useState<ConversationDetails[]>([]);

    useEffect(() => {
        GetOpenConversations().then((response: ConversationDetails[] | undefined)=>{
            if(response){
                setSelectedConversation(response);
            }
        })
    }, []);

    const onClose = (conversation: ConversationDetails)=>{
        let conversationItem = localStorage.getItem("Conversations");
        let conversationIds = conversationItem!.split(',');
        conversationIds = conversationIds.filter(conversationId => conversationId != conversation._id?.toString());
        localStorage.setItem('Conversations', conversationIds.toString());
        
        setSelectedConversation(prevSelections=> prevSelections.filter(selection=>selection._id?.toString() != conversation._id?.toString()));
    }
    
    return (
        <div className={styles.chatProvider}>
            <ChatBox title="Chat">
                <ChatList selectedConversations={selectedConversations} setSelectedConversation={setSelectedConversation} />
            </ChatBox>

            {selectedConversations.map((conversation, index)=>(
                <ChatBox key={index} onClose={()=>onClose(conversation)} title={conversation.chatTitle}>
                    <Conversation chatId={conversation._id!.toString()} />
                </ChatBox>
            ))}
        </div>
    )
}

async function GetOpenConversations(){
    let conversationItem = localStorage.getItem("Conversations");
    if(!conversationItem){
        return;
    }
    let conversationIds = conversationItem.split(',');
    let conversations: ConversationDetails[] = [];

    for(let conversationId of conversationIds){
        const conversation = await FetchConversation(conversationId);
        if(conversation){
            conversations.push(conversation);
        }
    }

    return conversations;
}