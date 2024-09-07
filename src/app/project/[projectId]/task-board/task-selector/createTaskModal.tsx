'use client'
import React, { useEffect, useRef, useState } from "react";
import styles from '../taskboard.module.css';
import DescriptionEditor from '@/components/editor/descriptionEditor';
import Loading from '@/components/loading/loading';
import dynamic from 'next/dynamic';
import { useFuzzySearchList, Highlight } from '@nozbe/microfuzz/react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AppAccount, Task } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { useRouter } from 'next/navigation';
import UserSelector from "@/components/user-selection/user-selector";

const CKEditorComponent = dynamic(() => import('../../../../../components/editor/editor'), {
    loading: ()=> <Loading/>,
    ssr: false,
});

interface taskProps{
    projectId: string;
}

export default function CreateTask({projectId}: taskProps){
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState('');
    const [selectedUser, setSelectedUser] = useState<AppAccount[]>([]);
    const [showUsers, setShowUsers] = useState(false);
    const router = useRouter();
    
    const ref = useRef(null); 
    const userInputRef = useRef(null);

    useEffect(()=>{
        function checkClick(event: any){
            const wasModalClicked = event.composedPath().includes(ref.current!);
            if(!wasModalClicked){
                setShowModal(false);
            }
            const wasUserInputClicked = event.composedPath().includes(userInputRef.current!);
            if(showUsers && !wasUserInputClicked){
                setShowUsers(false);
            }else if(!showUsers && wasUserInputClicked){
                setShowUsers(true);
            }
        }

        window.addEventListener("mousedown", checkClick);

        return () => {
            window.removeEventListener("mousedown", checkClick);
        };
    }, [showUsers])

    const onSubmit = async () => {
        const newTask: Task = {
            title: title,
            assignee: selectedUser?.at(0)?._id?.toString() || "",
            description: description,
            dueDate: new Date(dueDate)
        }

        await fetch(`/api/project/${projectId}/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newTask}),
        });

        setShowModal(false);
        router.refresh();
    }

    return (
        <>
            <button onClick={()=>setShowModal(true)} className={styles.createButton}>Create a New Task</button>

            {showModal && (
                <div className={styles.modalBackground}>
                    <div ref={ref} className={styles.modal}>
                        <div className={styles.inputBox}>
                            <label htmlFor='title'>Title:</label>
                            <input id='title' className={styles.loginInput} onChange={(event)=>setTitle(event.target.value)}/>
                        </div>

                        <div className={styles.inputBox}>
                            <label htmlFor='title'>Description:</label>
                            <CKEditorComponent data={description} onChange={(data: string) => setDescription(data)} />
                        </div>

                        <UserSelector projectId={projectId} multipleSelectors={false} selectedUsers={selectedUser} setUsers={setSelectedUser} />

                        <div className={styles.inputBox}>
                            <label htmlFor='dueDate'>Due Date:</label>
                            <DatePicker 
                                selected={dueDate} 
                                onChange={(date) => {if(date){setDueDate(date)}}} 
                                showTimeSelect
                                dateFormat={'hh:mm - dd/MM/yyyy'}
                            />
                        </div>

                        <div className={styles.buttons}>
                            <button onClick={()=>setShowModal(false)}>Cancel</button>
                            <button onClick={()=>onSubmit()}>Create Task</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}