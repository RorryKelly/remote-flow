'use client'
import { Suspense, useEffect, useRef, useState } from 'react';
import styles from './editor.module.css';
import dynamic from 'next/dynamic';
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Loading from '../loading/loading';

const CKEditorComponent = dynamic(() => import('./editor'), {
    loading: ()=> <Loading/>,
    ssr: false,
});

interface descriptionEditorProps {
    description: string,
    taskId: string,
}

export default function DescriptionEditor({description, taskId}: descriptionEditorProps){
    const [isActive, setIsActive] = useState(false);
    const ref = useRef(null);
    const [newDescription, setNewDescription] = useState<string>(description);

    useEffect(()=>{
        setNewDescription(description);
    }, [taskId])

    useEffect(() => {
        const handleClick = (event: Event) => {
            if(ref.current){
                const wasDescriptionClicked = event.composedPath().includes(ref.current!);
                if(!wasDescriptionClicked && description != newDescription && isActive){
                    const payload = {
                        newDescription: newDescription,
                        taskId: taskId,
                    }

                    fetch(`/api/task/${taskId}/description`,
                        {
                            method: 'PUT',
                            body: JSON.stringify(payload)
                        }
                    )
                }

                setIsActive(() => wasDescriptionClicked);
            }
        };

        window.addEventListener("mousedown", handleClick);

        return () => {
            window.removeEventListener("mousedown", handleClick);
        };
    }, [description, newDescription, isActive, ref, taskId]);

    const handleChange = (data: string) => {
        setNewDescription(data);
    }

    return (
        <div id='description-editor' ref={ref}>
            {!isActive ? (
                <div className={styles.description}>
                    <Markdown rehypePlugins={[rehypeRaw]}>
                        {newDescription}
                    </Markdown>
                </div>
            ) : (
                <CKEditorComponent data={newDescription} onChange={(data: string) => handleChange(data)} />
            )}
        </div>
    )
}