'use client'
import styles from '../project.module.css';
import { IoSendOutline } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { FaPlus,FaCheck } from "react-icons/fa6";

import { useState } from 'react';
import { Project } from '../../../../../lib/definitions';
import { useRouter } from 'next/navigation'

export default function Users({setProjectDetails, setCurrentScreen, projectDetails}: any){
    const [stages, setStages] = useState(['To do', 'Doing', 'Done']);
    const router = useRouter();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        setProjectDetails((proj: Project)=>({
            ...proj,
            stages: stages
        }))

        fetch('/api/create/project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectDetails),
        });
        router.push('/home');        
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
                                <label htmlFor={`task${index}`}>Stage {index + 1}:</label>
                                <input id={`task${index}`} className={styles.loginInput} defaultValue={task} onChange={(value)=> setStages((prevTask) => [
                                    ...prevTask.slice(0, index),
                                    value.target.value,
                                    ...prevTask.slice(index + 1)
                                ])}/>
                            </div>
                        ))}
                    </div>
                    

                    <div style={{marginRight: 'calc(32rem - 29.5rem)', marginLeft: 'auto'}}>
                        <button type='button' onClick={()=>setStages((prevTasks) => [...prevTasks, 'E.g new stage name'])} style={{right: 0, width: 'auto'}} className={`button light ${styles.button}`}>
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
                    {stages[0]}
                </div>
                
                <div style={{borderTop: '1px solid'}}>
                    {projectDetails.tasks?.map((task: string, index: number) => (
                        <div key={index} className={styles.projectInfo}>
                            <FaCheck size={32} />
                            <p>{task}</p>
                        </div>
                    ))}
                </div>

                <div>
                    {[...Array(20)].map((task:any, index: number) => (
                        <div key={`container-${index}`} >
                            {index % 3 == 0  && stages[(index / 3) + 1] &&  (
                                <div key={`stage-header-${index}`} style={{borderBottom: '1px solid'}} className={`${styles.stageTitle} subHeader`}>
                                    {stages[(index / 3) + 1]}
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