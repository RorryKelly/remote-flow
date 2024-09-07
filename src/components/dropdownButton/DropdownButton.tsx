'use client'
import Image from 'next/image';
import Checkbox from "react-custom-checkbox";
import styles from './DropdownButton.module.css';
import { FaCheckSquare } from "react-icons/fa";
import { useState } from 'react';
import { signIn } from '@/auth';


export default function DropdownButton( { googleLogin }: any ){
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div style={{position: 'relative'}}>
            <button data-cy="nav-login" className='dark button' onClick={()=>setShowLogin(!showLogin)}>
                Login
            </button>
            {showLogin && (
                <div className={styles.dropdownMenu}>
                    <Image 
                        width={82}
                        height={68}
                        src="/assets/Logo.png" 
                        alt="Remote Flow Logo - small"
                        className={styles.logo}/>

                    <div className={styles.loginText} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <div>
                        <label htmlFor='email'>Email:</label>
                        <input id='email' className={styles.loginInput}/>
                        </div>
                        
                        <div>
                        <label htmlFor='password'>Password:</label>
                        <input type='password' id='password' className={styles.loginInput} />
                        </div>

                        <div className={styles.stayLoggedIn}>
                        <Checkbox
                            icon={<FaCheckSquare />}
                            name="keepLoggedIn"
                            label="Keep me logged in"
                            style={{ fontSize: "30px", borderColor: "#3E506F", marginRight: '1rem' }}
                            />
                        </div>

                        <button className={styles.loginButton}> Login </button>

                        <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button data-cy="googleLogin" style={{backgroundColor: '#FFFFFF'}} className={styles.loginButton} onClick={()=>googleLogin()}> 
                            <Image 
                                width={50}
                                height={50}
                                src="/assets/googleIcon.png" 
                                alt="Remote Flow Logo - small"/>
                        </button>
                        <button style={{backgroundColor: '#FFFFFF'}} className={styles.loginButton}>
                            <Image 
                                width={40}
                                height={40}
                                src="/assets/facebookLogo.png" 
                                alt="Remote Flow Logo - small"/>
                        </button>
                        </div>

                        <a style={{textAlign: 'center', marginBottom: '1rem'}}>Don’t have an account? Sign Up</a>
                    </div>
                </div>
            )}
        </div>  
    )
}