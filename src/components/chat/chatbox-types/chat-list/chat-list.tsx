import { Dispatch, useEffect, useState } from "react"
import { FetchUserConversations } from "../../actions";
import parseJson from "@/components/json/parser";
import { ConversationDetails } from "@/lib/definitions";
import styles from '../../chat.module.css';
import { FaUser } from "react-icons/fa";
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked, MdCreate } from "react-icons/md";
import NewConversation from "./new-conversation";

interface ChatListProps{
    selectedConversations: ConversationDetails[],
    setSelectedConversation: Dispatch<React.SetStateAction<ConversationDetails[]>>
}

export default function ChatList({selectedConversations, setSelectedConversation}: ChatListProps){
    const [conversatons, setConversations] = useState<ConversationDetails[]>([]);
    

    useEffect(()=>{
        FetchUserConversations().then((res: string | undefined)=>{
            if(res){
                const convos = parseJson<ConversationDetails[]>(res);
                setConversations(convos);
            }
        });
    }, []);

    function selectConversation(conversation: ConversationDetails){
        let conversationItem = localStorage.getItem("Conversations");
        conversationItem = conversationItem 
            ? `${conversationItem},${conversation._id!.toString()}` 
            : conversation._id!.toString()
        localStorage.setItem("Conversations", conversationItem);
        setSelectedConversation((prevVal)=>([...selectedConversations, conversation]));
    }

    return (
        <div className={styles.chatboxContainer} style={{justifyContent: "flex-start"}}>
            <ul className={styles.chatlist}>
                {conversatons.map((conversation, index)=>(
                    <li key={`conversation-${index}`} className={styles.chatEntry} onClick={()=>selectConversation(conversation)}>
                        <span className={styles.authorPicture}>
                            <span className={styles.iconContainer}>
                                <FaUser size={'1.5rem'}/>
                            </span>
                        </span>

                        {conversation.chatTitle}

                        <span>
                            {selectedConversations.findIndex((value)=>value._id == conversation._id) != -1 
                                ? (<MdOutlineRadioButtonChecked size={'1.5rem'} />) 
                                : (<MdOutlineRadioButtonUnchecked size={'1.5rem'} />)}
                        </span>
                    </li>
                ))}
            </ul>

            <NewConversation projectId="66cb26be6cf5fa08a5e530f4" />
        </div>
    )
}