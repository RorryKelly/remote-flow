'use client'
import React, { useEffect, useRef, useState } from "react";
import styles from '../../chat.module.css';
import "react-datepicker/dist/react-datepicker.css";
import { AppAccount } from "@/lib/definitions";
import { useParams, useRouter } from 'next/navigation';
import { MdCreate } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import UserSelector from "@/components/user-selection/user-selector";
import clickCheck from "@/lib/click-check";
import { CreateNewConversation } from "../../actions";

export default function NewConversation(){
    const [title, setTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AppAccount[]>([]);
    const ref = useRef(null); 
    const { projectId } = useParams();

    useEffect(()=>{
        if(showModal){
            clickCheck(ref, showModal, setShowModal);
        }
    }, [showModal])

    const onSubmit = async () => {
        CreateNewConversation(title, selectedUser).then((result)=>{
            let conversationItem = localStorage.getItem("Conversations");
            conversationItem = conversationItem 
                ? `${conversationItem},${result!.insertedId!.toString()}` 
                : result!.insertedId!.toString()
            localStorage.setItem("Conversations", conversationItem);
            setShowModal(false);
        });
    }
    
    return (
        <>
            <button onClick={()=>{setShowModal(true)}} className={styles.createConvo}>
                <MdCreate />
                +
            </button>

            {showModal && (
                <div className={styles.modalBackground}>
                    <div ref={ref} className={styles.modal}>
                        <div className={styles.inputBox}>
                            <label htmlFor='chatName'>Chat Name:</label>
                            <input id='chatName' className={styles.newChatInput} onChange={(event)=>setTitle(event.target.value)}/>
                        </div>

                        <UserSelector 
                            label={'Participants'}
                            projectId={projectId as string} 
                            multipleSelectors 
                            selectedUsers={selectedUser} 
                            setUsers={setSelectedUser} />
                        
                        <button className={styles.button} onClick={()=>onSubmit()}>
                            <IoMdAdd />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}