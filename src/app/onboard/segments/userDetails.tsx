'use client'
import styles from '../project.module.css';
import { FiUser } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { IoSendOutline } from "react-icons/io5";
import '../project.module.css';
import { AppAccount, Project } from '../../../lib/definitions';
import { useEffect, useState } from 'react';

export default function UserDetails({setCurrentScreen, setProjectDetails}: any){
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');
    const [shareCode, setShareCode] = useState<string>('0000');

    useEffect(()=>{
        setShareCode((Math.floor(Math.random() * 10000) + 10000).toString().substring(1));
    }, [])

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const firstNameInput = form.elements.namedItem('firstName') as HTMLInputElement;
        const lastNameInput = form.elements.namedItem('lastName') as HTMLInputElement;
        const shareCodeInput = form.elements.namedItem('shareCode') as HTMLInputElement;
        let accountDetails = {} as AppAccount;

        accountDetails.firstName = firstNameInput.value;
        accountDetails.lastName = lastNameInput.value;
        accountDetails.sharecode = shareCode;


        const response = await fetch('/api/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountDetails),
        });

        const id = await response.json();
        console.log(id);

        setProjectDetails((proj: Project)=>({
            ...proj,
            createdBy: id
        }))

        setCurrentScreen((prevScreen: number) => prevScreen + 1);
    }

    return ( 
        <>
            <h1 className='header' style={{marginBottom: '2rem'}}>Tell us About Yourself</h1>

            <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.column}>
                    <div className={styles.photoIcon}>
                        <FiUser height="19.625rem" style={{marginTop: '2rem'}} fontSize={"19rem"}/>
                    </div>

                    <button type='button' style={{alignSelf: 'center'}} className={`button light ${styles.button}`}>
                        <LuUpload style={ { verticalAlign: 'middle' }} /> 
                        <span style={{marginLeft: '1rem'}}>Upload</span>
                    </button>
                </div>
                <div className={styles.column}>
                    <h2  className='subHeader'>Your Details</h2>
                    <div className={styles.inputBox}>
                        <label htmlFor='firstName'>First Name:</label>
                        <input id='firstName' onChange={(value) => setFirstName(value.target.value)} defaultValue={firstName} className={styles.loginInput}/>
                    </div>

                    <div className={styles.inputBox}>
                        <label htmlFor='lastName'>Last Name:</label>
                        <input id='lastName' onChange={(value) => setLastName(value.target.value)} defaultValue={lastName} className={styles.loginInput}/>
                    </div>

                    <div className={styles.inputBox}>
                        <label htmlFor='shareCode'>User Share Code:</label>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <span>{firstName}_{lastName}</span>
                            <span style={{opacity: '0.75', paddingRight: '1rem', width: '30%', textAlign: 'right'}}>#{shareCode}</span>
                        </div>
                    </div>

                    <button type='submit' style={{marginLeft: 'auto'}} className={`button light ${styles.button}`}>
                        <IoSendOutline  style={ { verticalAlign: 'middle' }} /> 
                        <span style={{marginLeft: '1rem'}}>Confirm</span>
                    </button>
                </div>
            </form>
        </>
    )
}