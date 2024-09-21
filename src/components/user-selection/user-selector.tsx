import { AppAccount } from "@/lib/definitions";
import { useFuzzySearchList } from "@nozbe/microfuzz/react";
import { useState, useRef, useEffect } from "react";
import styles from './selector.module.css';
import clickCheck from "@/lib/click-check";

interface userSelectorProps{
    label?: string;
    projectId: string;
    multipleSelectors: boolean;
    setUsers: React.Dispatch<React.SetStateAction<AppAccount[]>>;
    selectedUsers: AppAccount[];
}

export default function UserSelector({label, projectId, multipleSelectors, setUsers, selectedUsers}: userSelectorProps){
    const [queryText, setQueryText] = useState('');
    const [userList, setUserList] = useState<AppAccount[]>([]);
    const [showUsers, setShowUsers] = useState(false);
    const userInputRef = useRef(null);

    useEffect(()=>{
        async function getUsers(){
            const response = await fetch(`/api/project/${projectId}/users`);
            const newUserList = await response.json() as AppAccount[];
            setUserList(newUserList);
        }

        getUsers();
    }, [projectId]);

    useEffect(()=>{
        clickCheck(userInputRef, showUsers, setShowUsers);
    }, [showUsers])

    const refreshAssigneeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQueryText(event.target.value);
    }

    const onUserSelect = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, account: AppAccount)=>{
        setShowUsers(false);
        multipleSelectors 
            ? setUsers((prevUsers: AppAccount[]) => ([...prevUsers!, account]))
            : setUsers([account])
    }

    const filteredList = useFuzzySearchList({
        list: userList,
        queryText: queryText,
        getText: (item) => [item.firstName!, item.lastName!],
        mapResultItem: ({ item, score, matches: [highlightRanges] }) => (item)
    });

    const removeSelectedUsers = (index: number) => {
        setUsers((prevUsers) => ([
            ...prevUsers!.slice(0, index),
            ...prevUsers!.slice(index + 1)
        ]));
    }
    
    return (
        <>
            <div ref={userInputRef} className={styles.inputBox}>
                <label htmlFor='assignee'>{label || 'Assignee'}:</label>
                <input id='assignee' role="presentation" autoComplete="off" className={styles.newChatInput} onFocus={()=>setShowUsers(true)} onChange={(event)=> refreshAssigneeSearch(event)}/>
                {showUsers && (
                    <ListOfUsers accounts={filteredList} handleClick={(event, account)=> onUserSelect(event, account)}/>
                )}
            </div>

            <div className={styles.selectedUsers}>
                {selectedUsers?.map((selectedUser, index)=>(
                    <div key={`selectedUser-${index}`} className={styles.selectedUser}>
                        {selectedUser && (
                            <span onClick={()=>removeSelectedUsers(index)} >{selectedUser.firstName} {selectedUser.lastName} <b>X</b></span>
                        )}
                    </div>
                ))}
            </div>
        </>
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
                    {newAccounts?.map((account, index) =>(
                        <li onClick={(event)=> handleClick(event, account)} key={account.firstName!} className={styles.userEntry}>
                            {account.image} <span>{account.firstName} {account.lastName}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}