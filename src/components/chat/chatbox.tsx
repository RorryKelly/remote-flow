'use client'

import { FaChevronUp, FaChevronDown, FaRegWindowMinimize } from "react-icons/fa";
import styles from './chat.module.css';
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

interface ChatBoxProps{
    title: string,
    children: JSX.Element,
    onClose?: any,
}

export default function ChatBox({title, children, onClose}: ChatBoxProps){
    const [isOpen, setIsOpen] = useState(false);

    const ClosableActions = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'row', gap: '0.5rem'}}>
                <FaRegWindowMinimize />
                <MdOutlineClose onClick={()=>onClose()}/>
            </div>
        )
    }

    const NonClosableActions = () => {
        return !isOpen 
            ? (<FaChevronUp />) 
            : (<FaChevronDown />)
    }

    return (
        <div className={styles.chatbox}>
            <div className={styles.header} onClick={_ => setIsOpen(prevVal => !prevVal)}>
                {title || 'Chats'}
                {onClose != null 
                    ? (<ClosableActions />)
                    : (<NonClosableActions />)}
            </div>
            
            {isOpen && (
                <div className={styles.chatcontent}> 
                    {children}
                </div>
            )}
        </div>
        
    )
}