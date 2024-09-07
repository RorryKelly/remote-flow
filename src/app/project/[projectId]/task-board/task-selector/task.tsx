'use client'
import { ReactNode, useEffect, useState } from "react";
import styles from "../taskboard.module.css";
import { MdOutlineRadioButtonUnchecked, MdOutlineRadioButtonChecked } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import { useDraggable, useDroppable } from "@dnd-kit/core";

interface TaskProps{
    taskTitle: string,
    stageIcon: ReactNode,
    taskId: string,
}

export function Task({taskTitle, stageIcon, taskId}: TaskProps){
    const [isSelected, setIsSelected] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryCheck = searchParams.get('taskid');
    
    useEffect(()=>{
        if(queryCheck){
            setIsSelected(queryCheck.includes(taskId));
        }
    }, [queryCheck]);

    const handleOnClick = () =>{
        if(queryCheck){
            router.replace(`?taskid=${taskId}`);
        } else{
            router.push(`?taskid=${taskId}`);
        }
    }

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: taskId,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div id={taskTitle.replaceAll(' ', '-')} ref={setNodeRef} style={style} className={`${styles.task}`} onClick={handleOnClick} {...listeners} {...attributes}>
            <div className={styles.taskTitle}>
                {stageIcon}
                {taskTitle}
            </div>

            {isSelected ? (<MdOutlineRadioButtonChecked size={'1.5rem'} />) : (<MdOutlineRadioButtonUnchecked size={'1.5rem'} />)}
        </div>
);
}