'use client'
import styles from "../taskboard.module.css";
import { Task } from './task';
import { Stage, Task as TaskObj, TaskTableProps } from "../../../../../lib/definitions";
import { getTasks } from "../../../../../lib/db";
import {useDraggable, useDroppable} from '@dnd-kit/core';
import { Suspense, useEffect, useState } from "react";
import * as icons  from 'react-icons'
import { Icon } from "@/components/icons/icon";


interface StageSegmentProps {
    taskTableProps: TaskTableProps
}

export function StageSegment({taskTableProps}: StageSegmentProps){
    const [stageIcon, setStageIcon] = useState<JSX.Element>();

    useEffect(()=>{
        setStageIcon(Icon(taskTableProps.stage.icon));
    }, []);

    const {setNodeRef, isOver} = useDroppable({
        id: taskTableProps.stage._id?.toString()!,
    });

    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
            <div id={taskTableProps.stage.title} ref={setNodeRef} style={style}>
                <h2 className={`${styles.subHeader} subHeader`} style={{fontSize: '1.25rem', margin: 0}}>{taskTableProps.stage.title}</h2>

                <div className={styles.taskContainer}>
                    {taskTableProps.tasks?.map((task) =>(
                        <Task key={`${task.title}_${task._id}`} taskTitle={task.title} stageIcon={stageIcon} taskId={task._id!.toString()}  />
                    ))}
                </div>
            </div>
    );
}