import { Fragment, useEffect, useRef, useState } from "react";
import styles from '../../chat.module.css';
import { FaUser } from "react-icons/fa";
import { IoSendOutline } from "react-icons/io5";
import { AppAccount, ConversationMessage, MessageEvent } from "@/lib/definitions";
import { IncomingChat, OutGoingChat } from "./messages";
import openChatWebSocket from "@/lib/chat-websocket";

export default function Conversation({chatId}: any){
    const [message, setMessage] = useState("");
    const messageBoxEndRef = useRef<HTMLDivElement>(null);
    const [sentMessages, setSentMessages] = useState<ConversationMessage[]>([]);
    const [userList, setUserList] = useState<AppAccount[]>([]);

    const [websocket, setWebsocket] = useState<WebSocket>();

    useEffect(()=>{
        const {cleanup, ws} = openChatWebSocket(chatId, setSentMessages, setUserList);

        setWebsocket(ws);
        window.addEventListener('beforeunload', cleanup);

        return () => {
            window.removeEventListener('beforeunload', cleanup);
        };
    }, [chatId]);

    useEffect(()=>{
        if(messageBoxEndRef && messageBoxEndRef.current){
            messageBoxEndRef.current.scrollIntoView({behavior: "smooth", block: "end", inline: "end"});
        }
    }, [sentMessages])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.currentTarget.value);
    }

    const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage = {
            chatId,
            actionType: 'message',
            data: {
                message: message,
                timestamp: new Date(),
                sender: "",
                incoming: false,
            }
        } as MessageEvent;

        websocket?.send(JSON.stringify(newMessage));
        setMessage('');
    }

    return (
        <div className={styles.chatboxContainer}>
            <div className={styles.messageArea}>
                {sentMessages.map((message, index)=>(
                    <Fragment key={index}>
                        {message.incoming
                            ? (<IncomingChat 
                                    message={message} 
                                    printName={!sentMessages[index-1] || sentMessages[index-1].sender != message.sender} 
                                    printTimeStamp={!sentMessages[index+1] || sentMessages[index+1].incoming != message.incoming}
                                    user={userList.find(user => user._id?.toString() == message.sender)}/>)
                            : (<OutGoingChat 
                                    message={message} 
                                    printName={!sentMessages[index-1] || sentMessages[index-1].sender != message.sender} 
                                    printTimeStamp={!sentMessages[index+1] || sentMessages[index+1].incoming != message.incoming}
                                    user={userList.find(user => user._id?.toString() == message.sender)}/>)}
                    </Fragment>
                ))}

                <div style={{scrollMarginBottom: '1000px'}} ref={messageBoxEndRef}/>
            </div>

            <form onSubmit={sendMessage} className={styles.input}>
                <input name="message" value={message} onChange={handleChange}/>
                <button type="submit">
                    <IoSendOutline  style={ { verticalAlign: 'middle' }} /> 
                </button>
            </form>
        </div>
    );
}