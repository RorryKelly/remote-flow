'use client'
import styles from '../project.module.css';
import { IoSendOutline } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { FaPlus,FaCheck } from "react-icons/fa6";

import { ChangeEvent, useEffect, useState } from 'react';
import { Project, Stage, Task } from '../../../lib/definitions';
import { updateTaskStage } from '@/lib/db';

export default function Stages({setProjectDetails, setCurrentScreen, projectDetails}: any){
    const [stages, setStages] = useState<Stage[]>([
        {
            title: 'To do',
            pos: 1,
            icon: 'FaRegClock',
            tasks: projectDetails.tasks,
            projectId: ''
        },
        {
            title: 'Doing',
            pos: 2,
            icon: 'FaRegCircle',
            tasks: [],
            projectId: ''
        },
        {
            title: 'Done',
            pos: 3,
            icon: 'FaRegCheckCircle',
            tasks: [],
            projectId: ''
        }
    
    ]);
    const [post, shouldPost] = useState(false);

    useEffect(()=>{
        if(post){
            postProject();
            setCurrentScreen((prevScreen: number) => prevScreen + 1);
        }
    }, [post])

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        setProjectDetails((proj: Project)=>({
            ...proj,
            stages: stages
        }));
        
        shouldPost(true);
    }    

    const postProject = async () => {
        const response = await fetch('/api/project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectDetails),
        });

        const id = await response.json();

        setProjectDetails((prevVal: Project) => ({
            ...prevVal,
            _id: id,
        }));

        fetch(`/api/project/${id}/users/${projectDetails.createdBy}`, {
            method: 'POST'
        });
    }

    const UpdateStages = (title: string, index: number) => {
        const updatedStage: Stage = {
            title: title,
            pos: stages[index].pos,
            icon: stages[index].icon,
            tasks: stages[index].tasks,
            projectId: ''
        }

        setStages((prevStages) => ([
            ...prevStages.slice(0, index),
            updatedStage,
            ...prevStages.slice(index + 1)
        ]));
    }

    const CreateNewStage = () => {
        const newStage: Stage = {
            title: 'E.g new stage name',
            pos: stages.length, 
            icon: stages[stages.length - 1].icon,
            tasks: [],
            projectId: ''
        }

        setStages(prevStages => ([
            ...prevStages,
            newStage
        ]))
    }

    return (
        <div className={styles.projectDetailsView}>
            <div className={styles.detailsForm}>
                <div className={`${styles.progressBar}`} style={{width: '400px', display: 'flex', gap: '0.5rem'}}>
                    <span style={{  width: '60%' }}></span>
                    <span style={{ width: '40%' }}> </span>
                </div>

                <h1 className='header'>Create Some Task Stages</h1>

                <form className={styles.scrollableForm} onSubmit={onSubmit}>
                    <div style={{overflowY: 'scroll', maxHeight: '17.5rem' }} className={styles.scrollableInputs}>
                        {stages.map((task, index)=>(
                            <div key={index} className={styles.inputBox} >
                                <label htmlFor={`stage${index}`}>Stage {index + 1}:</label>
                                <input id={`stage${index}`} className={styles.loginInput} defaultValue={task.title} onChange={(value)=> UpdateStages(value.target.value, index)}/>
                            </div>
                        ))}
                    </div>
                    

                    <div style={{marginRight: 'calc(32rem - 29.5rem)', marginLeft: 'auto'}}>
                        <button type='button' onClick={()=>CreateNewStage()} style={{right: 0, width: 'auto'}} className={`button light ${styles.button}`}>
                            <FaPlus  style={ { verticalAlign: 'middle' }} /> 
                        </button>
                        <button type='submit' style={{right: 0, marginTop: '64.188px', marginLeft: '1rem'}} className={`button light ${styles.button}`}>
                            <IoSendOutline  style={ { verticalAlign: 'middle' }} /> 
                            <span style={{marginLeft: '1rem'}}>Confirm</span>
                        </button>
                    </div>
                </form>
            </div>
            <div className={styles.projectSheet}>
                <div className={styles.projectTitle}>
                    <div className={styles.sheetIcon}> <FaList/> </div>
                    <h2>{projectDetails.title}</h2>
                </div>

                <div className={`${styles.stageTitle} subHeader`}>
                    {stages[0].title}
                </div>
                
                <div style={{borderTop: '1px solid'}}>
                    {projectDetails.tasks?.map((task: Task, index: number) => (
                        <div key={index} className={styles.projectInfo}>
                            <FaCheck size={32} />
                            <p>{task.title}</p>
                        </div>
                    ))}
                </div>

                <div>
                    {[...Array(20)].map((task:any, index: number) => (
                        <div key={`container-${index}`} >
                            {index % 3 == 0  && stages[(index / 3) + 1] && (
                                <div key={`stage-header-${index}`} style={{borderBottom: '1px solid'}} className={`${styles.stageTitle} subHeader`}>
                                    {stages[(index / 3) + 1].title}
                                </div>
                            )}
                            <div key={index} className={styles.projectInfo}>
                                <FaCheck size={32} />
                                <div className={styles.titleblock}></div>
                            </div>
                        </div>
                        
                    ))}
                </div>
            </div>
        </div>
    );
}