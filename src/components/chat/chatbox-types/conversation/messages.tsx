import styles from '../../chat.module.css';
import { FaUser } from "react-icons/fa";
import { AppAccount, ConversationMessage, MessageEvent } from "@/lib/definitions";

interface ChatProps{
    message: ConversationMessage, 
    printName: boolean,
    printTimeStamp: boolean,
    user: AppAccount | undefined
}

export function IncomingChat({message, printName, printTimeStamp, user}: ChatProps){
    return (
        <div className={styles.incomingChat}>
            {printTimeStamp 
                ? (
                    <div>
                        {message.icon ? message.icon : <FaUser />}
                    </div>
                )
                : (
                    <span style={{width: '2rem'}}>

                    </span>
                )
            }
            <div className={styles.messageText}>
                {printName && user
                            && (<p>{user.firstName} {user.lastName}</p>)}
                <span>
                    {message.message}
                </span>
                {printTimeStamp 
                    && (<p>{message.timestamp.toLocaleTimeString()}</p>)}
            </div>
        </div>
    )
}

export function OutGoingChat({message, printName, printTimeStamp, user}: ChatProps){
    return (
        <div className={styles.outgoingChat}>
            <div className={styles.messageText}>
                {printName && user
                        && (<p>{user.firstName} {user.lastName}</p>)}
                <span>
                    {message.message}
                </span>
                {printTimeStamp 
                    && (<p>{message.timestamp.toLocaleTimeString()}</p>)}
            </div>
            {printTimeStamp 
                ? (
                    <div>
                        {message.icon ? message.icon : <FaUser />}
                    </div>
                )
                : (
                    <span style={{width: '2rem'}}>
                    </span>
                )
            }
        </div>
    )
}