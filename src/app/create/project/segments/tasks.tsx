'use client'
import styles from '../project.module.css';
import { IoSendOutline } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { FaPlus,FaCheck } from "react-icons/fa6";

import { useState } from 'react';
import { Project } from '../../../../../lib/definitions';

export default function Tasks({setProjectDetails, setCurrentScreen, projectDetails}: any){
    const [tasks, setTasks] = useState(['E.g Draft Project Brief', 'E.g Schedule Kick-off Meeting', 'E.g Share Timeline with Teammates']);


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        setProjectDetails((proj: Project)=>({
            ...proj,
            tasks: tasks
        }))
        setCurrentScreen((prevScreen: number) => prevScreen + 1);
    }    

    return (
        <div className={styles.projectDetailsView}>
            <div className={styles.detailsForm}>
                <div className={`${styles.progressBar}`} style={{width: '400px', display: 'flex', gap: '0.5rem'}}>
                    <span style={{  width: '30%' }}></span>
                    <span style={{ width: '70%' }}> </span>
                </div>

                <h1 className='header'>Create A Few Tasks</h1>

                <form className={styles.scrollableForm} onSubmit={onSubmit}>
                    <div style={{overflowY: 'scroll', maxHeight: '17.5rem' }} className={styles.scrollableInputs}>
                        {tasks.map((task, index)=>(
                            <div key={index} className={styles.inputBox} >
                                <label htmlFor={`task${index}`}>Task {index + 1}:</label>
                                <input id={`task${index}`} className={styles.loginInput} defaultValue={task} onChange={(value)=> setTasks((prevTask) => [
                                    ...prevTask.slice(0, index),
                                    value.target.value,
                                    ...prevTask.slice(index + 1)
                                ])}/>
                            </div>
                        ))}
                    </div>
                    

                    <div style={{marginRight: 'calc(32rem - 29.5rem)', marginLeft: 'auto'}}>
                        <button type='button' onClick={()=>setTasks((prevTasks) => [...prevTasks, 'E.g new task name'])} style={{right: 0, width: 'auto'}} className={`button light ${styles.button}`}>
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
                
                <div style={{borderTop: '1px solid'}}>
                    {tasks.map((task, index) => (
                        <div key={index} className={styles.projectInfo}>
                            <FaCheck size={32} />
                            <p>{task}</p>
                        </div>
                    ))}
                </div>

                <div>
                    {[...Array(20)].map((task, index) => (
                        <div key={index} className={styles.projectInfo}>
                            <FaCheck size={32} />
                            <div className={styles.titleblock}></div>
                        </div>
                    ))}
                </div>
                
                
            </div>
        </div>
    );
}