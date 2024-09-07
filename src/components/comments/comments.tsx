'use client'
import { comment } from "../../../src/lib/definitions";
import styles from "./comments.module.css";
import CommentEditor from "../editor/commentEditor";
import { GetTasksComments } from "../../../src/lib/db";
import { useEffect, useState } from "react";
import { User } from "next-auth";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import parseJson from "../json/parser";
import { FaUser } from "react-icons/fa";


interface commentsProps {
    value: number,
    comments: string
    currentUser: string
    taskId: string
}

const Comments = (commentsProps: commentsProps)=>{
    const [comments, setComments] = useState<comment[]>(parseJson<comment[]>(commentsProps.comments));
    const taskId = commentsProps.taskId;

    useEffect(()=>{
        setComments(parseJson<comment[]>(commentsProps.comments));
    }, [taskId, commentsProps.comments])

    const handleSubmit = (newComment: string) => {
        const newCommentEntry = {
            statement: newComment,
            createdAt: new Date(Date.now()),
            lastUpdated: new Date(Date.now()),
            taskId: taskId,
            author: commentsProps.currentUser
        } as comment;

        fetch(`/api/task/${commentsProps.taskId}/comment`, {
            body: JSON.stringify(newCommentEntry),
            method: 'POST'
        });

        setComments((prevComments)=> [...prevComments, newCommentEntry] )
    }

    return (
        <div id="comment-section">
            {comments.map((comment, index)=>(
                <div key={`${comment.author}-${index}`} className={styles.comment}>
                    <span className={styles.authorPicture}><span className={styles.iconContainer}><FaUser size={'1.5rem'}/></span></span>
                    <span className={styles.statement}>
                        <div>
                            <b>{comment.author}</b>
                        </div>
                        <div>
                            <Markdown rehypePlugins={[rehypeRaw]}>
                                {comment.statement}
                            </Markdown>
                        </div>
                    </span>
                    <span>{comment.createdAt?.toLocaleString()}</span>
                </div>
            ))}

            <div>
                <CommentEditor handleSubmit={handleSubmit} taskMetadataId={taskId} />
            </div>
        </div>
    )
}

export default Comments;