'use client'
import styles from '../project.module.css';
import { IoSendOutline } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { FaPlus,FaCheck } from "react-icons/fa6";

import { Fragment, useState } from 'react';
import { AppAccount, Project, Stage } from '../../../lib/definitions';
import { useRouter } from 'next/navigation'
import getCookie from '@/lib/get-cookie';

interface ProjectDetailsProps {
    setProjectDetails?: React.Dispatch<React.SetStateAction<Project>>
    setCurrentScreen?: React.Dispatch<React.SetStateAction<number>>
    projectDetails?: Project
}

export default function Users({setProjectDetails, setCurrentScreen, projectDetails}: ProjectDetailsProps){
    const [users, setUsers] = useState<AppAccount[]>([{
        firstName: '',
        lastName: '',
        sharecode: ''
    }]);
    const [errorIndicies, setErrorIndicies] = useState<number[]>([]);

    const router = useRouter();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const errors = await assignUsers();        

        if(errors.length == 0){
            router.push(`/project/${projectDetails?._id}/task-board`);        
        } else {
            setErrorIndicies(errors);
        }
    }

    const assignCreator = async () => {
        const oAuthId = getCookie('authjs.session-token');
        const response = await fetch(`/api/users?oAuthId=${oAuthId}`);

        if(response.status == 200){
            const result = await response.json() as AppAccount;
            fetch(`/api/project/${projectDetails?._id?.toString()}/users/${result._id?.toString()}`, {
                method: 'POST'
            });
        }
    }

    const assignUsers = async (): Promise<number[]> => {
        let errors: number[] = [];
        
        assignCreator();

        for(let i = 0; i < users.length; i++){
            const response = await fetch(`/api/users?firstName=${users[i].firstName}&lastName=${users[i].lastName}&sharecode=${users[i].sharecode}`);
            if(response.status == 200){
                const result = await response.json() as AppAccount;
                fetch(`/api/project/${projectDetails?._id?.toString()}/users/${result._id?.toString()}`, {
                    method: 'POST'
                });
            } else {
                errors.push(i);
            }
        }

        return errors;
    }

    const updateUsers = (firstName: string, lastName: string, shareCode: string, index: number)=>{
        const updatedUser: AppAccount = {
            firstName: firstName,
            lastName: lastName,
            sharecode: shareCode
        };

        setUsers((prevUser) => ([
            ...prevUser.slice(0, index),
            updatedUser,
            ...prevUser.slice(index + 1)
        ]));
    }

    const removeUser = (index: number) => {
        const newUserList = users.filter((_, i) => i != index);
        console.log(newUserList);
        setUsers(newUserList);
    }

    return (
        <div className={styles.projectDetailsView}>
            <div className={styles.detailsForm}>
                <div className={`${styles.progressBar}`} style={{width: '400px', display: 'flex', gap: '0.5rem'}}>
                    <span style={{  width: '90%' }}></span>
                    <span style={{ width: '10%' }}> </span>
                </div>

                <h1 className='header'>Add Users To The Project</h1>

                <form className={styles.scrollableForm} onSubmit={onSubmit}>

                    <div style={{overflowY: 'scroll', maxHeight: '17.5rem' }} className={styles.scrollableInputs}>
                        {users.map((user, index)=>(
                            <Fragment key={index}>
                                {errorIndicies.includes(index) && (
                                    <b style={{color: 'red', marginBottom: '0.5rem'}}>User Not Found!</b>
                                )}
                                <div style={{border: errorIndicies.includes(index) ? '1px solid red' : '' }} className={`${styles.inputBox} ${styles.inlineInput}`}>
                                    <div>
                                        <label htmlFor={`firstName${index}`}>First Name:</label>
                                        <input id={`firstName${index}`} className={styles.loginInput} placeholder="John" value={user.firstName} onChange={(event)=>{updateUsers(event.target.value, users.at(index)?.lastName!, users.at(index)?.sharecode!, index)}}/>
                                    </div>
                                    <div>
                                        <label htmlFor={`lastName${index}`}>Last Name:</label>
                                        <input id={`lastName${index}`} className={styles.loginInput} placeholder="Doe" value={user.lastName} onChange={(event)=>{updateUsers(users.at(index)?.firstName!, event.target.value, users.at(index)?.sharecode!, index)}}/>
                                    </div>
                                    <div>
                                        <label htmlFor={`shareCode${index}`}>Share Code:</label>
                                        <span style={{display: 'flex', flexDirection: 'row'}}>
                                            <b style={{opacity: '0.5', marginRight: '0.5rem'}}>#</b>
                                            <input id={`shareCode${index}`} className={styles.loginInput} value={user.sharecode} onChange={(event)=>{updateUsers(users.at(index)?.firstName!, users.at(index)?.lastName!, event.target.value, index)}}/> 
                                        </span>
                                    </div>

                                    {index > 0 && (
                                        <div className={styles.remoteSelection} onClick={()=>removeUser(index)}>
                                            X
                                        </div>
                                    )}
                                </div>
                            </Fragment>
                        ))}
                    </div>

                    <div style={{marginRight: 'calc(32rem - 29.5rem)', marginLeft: 'auto'}}>
                        <button type='button' onClick={()=>setUsers((prevUsers) => [...prevUsers, {firstName: '', lastName: '', sharecode: ''}])} style={{right: 0, width: 'auto'}} className={`button light ${styles.button}`}>
                            <FaPlus  style={ { verticalAlign: 'middle' }} /> 
                        </button>
                        <button type='submit' style={{right: 0, marginTop: '64.188px', marginLeft: '1rem'}} className={`button light ${styles.button}`}>
                            <IoSendOutline  style={ { verticalAlign: 'middle' }} /> 
                            <span style={{marginLeft: '1rem'}}>Confirm</span>
                        </button>
                    </div>
                    
                    <button 
                        id='skip' 
                        type='button' 
                        onClick={()=> {
                            assignCreator();
                            router.push(`/project/${projectDetails?._id}/task-board`) 
                        }} 
                        style={{marginTop: '1rem', marginRight: 'calc(32rem - 29.5rem)', marginLeft: 'auto'}} 
                        className={`button light ${styles.button}`}
                    >
                        <span style={{marginLeft: '1rem'}}>Skip</span>
                    </button>
                </form>
            </div>

            <div className={styles.projectSheet}>
                <div className={styles.projectTitle}>
                    <div className={styles.sheetIcon}> <FaList/> </div>
                    <h2>{projectDetails?.title}</h2>
                </div>

                <div>
                    {[...Array(20)].map((user:any, index: number) => (
                        <div key={`container-${index}`} >
                            {index % 3 == 0  && projectDetails?.stages?.at((index / 3)) &&  (
                                <div key={`stage-header-${index}`} style={{borderBottom: '1px solid'}} className={`${styles.stageTitle} subHeader`}>
                                    {
                                        (projectDetails?.stages.at((index / 3)) as Stage).title
                                    }
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