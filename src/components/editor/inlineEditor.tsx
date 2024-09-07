'use client'
import dynamic from 'next/dynamic';
import Loading from '../loading/loading';
import { AppAccount } from '@/lib/definitions';
import styles from './editor.module.css';
import { useEffect, useRef, useState } from 'react';
import { useFuzzySearchList } from '@nozbe/microfuzz/react';
import { FaCheck, FaBan } from "react-icons/fa";


const CKEditorComponent = dynamic(() => import('./editor'), {
    loading: ()=> <Loading/>,
    ssr: false,
});

interface assignProps{
    projectId: string;
    taskId: string;
    assigneeJSON: string;
}

export default function InlineAssignEditor({projectId, taskId, assigneeJSON}: assignProps){
    const [queryText, setQueryText] = useState('');
    const [userList, setUserList] = useState<AppAccount[]>([]);
    const [selectedUser, setSelectedUser] = useState<AppAccount | undefined>();
    const [showUsers, setShowUsers] = useState(false);    
    const [showEditor, setShowEditor] = useState(false);
    const [assignee, setAssignee] = useState<AppAccount>();

    const userInputRef = useRef(null);
    const refreshAssigneeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQueryText(event.target.value);
    }

    useEffect(()=>{
        async function getUsers(){
            const response = await fetch(`/api/project/${projectId}/users`);
            const newUserList = await response.json() as AppAccount[];
            setUserList(newUserList);
        }

        getUsers();
    }, []);

    useEffect(()=>{
        function checkClick(event: any){
            const wasUserInputClicked = event.composedPath().includes(userInputRef.current!);
            if(showUsers && !wasUserInputClicked){
                setShowUsers(false);
            }else if(!showUsers && wasUserInputClicked){
                setShowUsers(true);
            }
        }

        window.addEventListener("mousedown", checkClick);

        return () => {
            window.removeEventListener("mousedown", checkClick);
        };
    }, [showUsers]);

    useEffect(()=>{
        if(assigneeJSON){
            setAssignee(JSON.parse(assigneeJSON) as AppAccount);
        }
    }, [assigneeJSON]);

    const filteredList = useFuzzySearchList({
        list: userList,
        queryText: queryText,
        getText: (item) => [item.firstName!, item.lastName!],
        mapResultItem: ({ item, score, matches: [highlightRanges] }) => (item)
    });

    const onUserSelect = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, account: AppAccount)=>{
        setQueryText(account.firstName + " " + account.lastName);
        setSelectedUser(account)
        setShowUsers(false);
    }

    const onAssignUser = async (account: AppAccount | undefined) => {
        if(account){
            await fetch(`/api/project/${projectId}/task/${taskId}/assign/${account._id?.toString()}`, {
                    method: 'POST'
                }
            )
            setAssignee(account);
        }

        setShowEditor(false);
    }

    return showEditor ? (
        <div className={styles.inlineEditorContainer} ref={userInputRef}>
            <span className={styles.inlineEditorInput}>
                <input 
                    id='assignee' 
                    autoComplete="off" 
                    className={styles.loginInput} 
                    onFocus={()=>setShowUsers(true)} 
                    onChange={(event)=> refreshAssigneeSearch(event)}
                    value={queryText}
                    />
                <button onClick={()=> onAssignUser(undefined)}><FaBan /></button>
                <button onClick={()=> onAssignUser(selectedUser)}><FaCheck /></button>
            </span>
            {showUsers && (
                <ListOfUsers accounts={filteredList} handleClick={(event, account)=> onUserSelect(event, account)}/>
            )}
        </div>
    ) 
    : assignee 
        ? (
            <div onClick={()=>{setShowEditor(true)}} className={styles.assignee}>
                <p>{assignee?.firstName} {assignee?.lastName}</p>
            </div>
        ) 
        : (
            <div onClick={()=>{setShowEditor(true)}} className={styles.assignee}>
                <p>Unassigned</p>
            </div>
        );
}

interface userListProps {
    accounts: AppAccount[],
    handleClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>, account: AppAccount)=>void,
}

const ListOfUsers = ({accounts, handleClick}: userListProps) => {
    let newAccounts: AppAccount[];
    if(accounts.length > 50){
        newAccounts = [];
    } else if (accounts.length > 5){
        newAccounts = accounts.splice(0, 5);
    } else {
        newAccounts = accounts;
    }
    
    return newAccounts.length >= 1 && (
        <div className={styles.userListContainer}>
            <div className={styles.usersList}>
                <ul>
                    {newAccounts.map((account, index) =>(
                        <li onClick={(event)=> handleClick(event, account)} key={account.firstName!} className={styles.userEntry}>
                            {account.image} <span>{account.firstName} {account.lastName}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}