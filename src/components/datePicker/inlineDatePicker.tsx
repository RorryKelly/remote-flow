'use client'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import styles from './inlineDatePicker.module.css';

interface InlineDatePickerProps{
    initDate: Date,
    taskId: string,
    handleSubmit: (dueDate: Date, taskId: string)=>void
}

export default function InlineDatePicker({initDate, taskId, handleSubmit}: InlineDatePickerProps){
    const [dueDate, setDueDate] = useState<Date>(initDate);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const ref = useRef(null);

    useEffect(()=>{
        setDueDate(initDate);
    }, [initDate, taskId]);

    useEffect(()=>{
        function checkClick(event: any){
            const wasModalClicked = event.composedPath().includes(ref.current!);
            if(wasModalClicked){
                setShowDatePicker(true);
            } else {
                setShowDatePicker(false);
            }
        }
    
        window.addEventListener("mousedown", checkClick);
    
        return () => {
            window.removeEventListener("mousedown", checkClick);
        };
    })

    function handleDateChange(date: Date | null) {
        if(date && dueDate != date){
            setDueDate(date);
            handleSubmit(date, taskId);
        }
    }

    return showDatePicker ? (
        <div ref={ref}>
            <DatePicker 
                selected={dueDate} 
                onChange={handleDateChange} 
                showTimeSelect
                dateFormat={'hh:mm - dd/MM/yyyy'}
            />
        </div>
        
    ) 
    : (
        <div className={styles.dueDate} ref={ref}>
            <p>{dueDate?.toLocaleString()}</p>
        </div>
    );
}