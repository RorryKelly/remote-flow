'use client'
import { useEffect, useRef, useState } from 'react';
import styles from './editor.module.css';
import { FaPlus } from "react-icons/fa6";
import { comment, TaskMetadata } from '../../../src/lib/definitions';
import { revalidatePath } from 'next/cache';
import dynamic from 'next/dynamic';
import Loading from '../loading/loading';

const CKEditorComponent = dynamic(() => import('./editor'), {
    loading: ()=> <Loading/>,
    ssr: false,
});

interface commentEditorProps {
    taskMetadataId: string;
    handleSubmit: (newComment: string) => void;
}

export default function CommentEditor({taskMetadataId, handleSubmit}: commentEditorProps){
    const [isActive, setIsActive] = useState(false);
    const ref = useRef(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const handleOutSideClick = (event: Event) => {
            if(ref.current){
                setIsActive(() => event.composedPath().includes(ref.current!));
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
        window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [ref]);

    const handleChange = (data: string) => {
        setNewComment(data);
    }
    
    const style = { '--ckEditor-height': '50px' } as React.CSSProperties;

    return (
        <div style={style} ref={ref}>
            {!isActive ? (
                <div className={styles.commentButton}>
                    <FaPlus/> 
                    <b>Create A New Comment</b>
                </div>
            ) : (
                <div id={'editor'} className={styles.commentInput}>
                    <CKEditorComponent data={newComment} onChange={(data: string) => handleChange(data)} />
                    <button onClick={() => handleSubmit(newComment)} className={styles.postComment}>Post!</button>
                </div>
            )}
        </div>
    )
}