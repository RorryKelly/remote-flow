'use client'
import { getStagesForProject, getUserProjects } from "../../../../../lib/db";
import { redirect } from 'next/navigation'
import { auth } from "@/auth";
import styles from "../taskboard.module.css";
import { StageSegment } from "./stageSegment";
import { Stage, Task, TaskTableProps } from "../../../../../lib/definitions";
import {DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors,} from '@dnd-kit/core';
import {restrictToVerticalAxis, restrictToWindowEdges} from '@dnd-kit/modifiers';
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import parseJson from "@/components/json/parser";

interface Props{
    taskTableProps: string;
    projectId: string;
}

export default function TaskTable({taskTableProps, projectId}: Props){
    const [taskTableObj, setTaskTableObj] = useState<TaskTableProps[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            delay: 150,
            tolerance: 250,
          },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 150,
            tolerance: 250,
          },
    });
    const keyboardSensor = useSensor(KeyboardSensor);

    const sensors = useSensors(
        mouseSensor,
        touchSensor,
        keyboardSensor,
    );

    useEffect(()=>{
        setTaskTableObj(parseJson<TaskTableProps[]>(taskTableProps))
    }, []);
    
    function handleDragEnd(event: DragEndEvent) {
        if (event.over) {
            const taskId = event.active.id.toString();
            const stageId = event.over.id.toString();
            changeStage(stageId, taskId, taskTableObj, projectId).then(()=>{
                const paramId =  searchParams.get('taskid') || '';
                if(paramId == taskId){
                    router.refresh();
                }
            });
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]} sensors={sensors}>
            <div id="activeTaskTable">
                {taskTableObj?.map((props, index)=>(
                    <StageSegment key={index} taskTableProps={props}/>
                ))}
            </div>
        </DndContext>
    );
}

const changeStage = async (stageId: string, taskId: string, taskTableProps: TaskTableProps[], projectId: string) => {
    let foundTask: Task | undefined;

    for(let i = 0; i <= taskTableProps.length; i++){
        if(foundTask){
            break;
        }

        const taskIndex = taskTableProps[i].tasks.findIndex(task => task._id?.toString() == taskId)
        if(taskIndex != -1){
            foundTask = taskTableProps[i].tasks[taskIndex];
            taskTableProps[i].tasks.splice(taskIndex, 1);
            fetch(`/api/project/${projectId}/task/${taskId}/updateStage/${stageId}`, {
                method: 'PUT'
            });
        }
    }

    if(!foundTask){
        return;
    }

    foundTask.stageId = stageId;
    const foudnStageId = taskTableProps.findIndex(prop=> prop.stage._id?.toString() == stageId);
    if(foudnStageId == -1){
        return;
    }

    taskTableProps[foudnStageId].tasks.push(foundTask);
    
    return taskTableProps;
}