'use client'
import styles from '../project.module.css';
import { IoSendOutline } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { useState } from 'react';


export default function ProjectName({setProjectDetails, setCurrentScreen}: any){
    const [projectName, setProjectName] = useState('Test Proj');
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const projectNameInput = form.elements.namedItem('projectName') as HTMLInputElement;
        
        setProjectDetails((prevState: any) => ({
            ...prevState,
            title: projectNameInput.value
        }));

        setCurrentScreen((prevScreen: number) => prevScreen + 1)
    }    

    return (
        <div className={styles.projectDetailsView}>
            <div className={styles.detailsForm}>
                <div className={`${styles.progressBar}`} style={{width: '400px', display: 'flex', gap: '0.5rem'}}>
                    <span style={{  width: '10%' }}></span>
                    <span style={{ width: '90%' }}> </span>
                </div>

                <h1 className='header'>What would you like to name your project?</h1>

                <form onSubmit={onSubmit}>
                    <div className={styles.inputBox}>
                        <label htmlFor='projectName'>Project Name:</label>
                        <input id='projectName' className={styles.loginInput} defaultValue={projectName} onChange={(value)=> setProjectName(value.target.value)}/>
                    </div>

                    <button type='submit' style={{right: 0, marginTop: '64.188px'}} className={`button light ${styles.button}`}>
                        <IoSendOutline  style={ { verticalAlign: 'middle' }} /> 
                        <span style={{marginLeft: '1rem'}}>Confirm</span>
                    </button>
                </form>
            </div>
            <div className={styles.projectSheet}>
                <div className={styles.projectTitle}>
                    <div className={styles.sheetIcon}> <FaList/> </div>
                    <h2>{projectName}</h2>
                </div>
            </div>
        </div>
    );
}