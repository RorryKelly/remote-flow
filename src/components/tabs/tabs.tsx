'use client'
import { Component, useEffect, useRef, useState } from "react"; 
import styles from './tabs.module.css';
import Switch from "../switch/switch";
import { comment } from "../../../src/lib/definitions";

interface tabsProps{
    headers: string[],
    children: JSX.Element[]
}

export default function Tabs({headers, children}: tabsProps){
    const tabsSection = useRef<any>([]);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(()=>{handleSelection(0)}, [tabsSection]);

    const handleSelection = (tab: number)=>{
        tabsSection.current[selectedTab].style.opacity = 0.5;
        tabsSection.current[tab].style.opacity = 1;       
        setSelectedTab(tab); 
    }

    return (
        <div className={styles.tabsSection}>
            <span className={styles.tabs}>
                {headers.map((header, index)=>(
                    <h4 key={index} onClick={()=> handleSelection(index)} ref={(el) =>{ tabsSection.current[index] = el}}>{header}</h4> 
                ))}
            </span>
            
            <Switch test={selectedTab}>
                {children}
            </Switch>
        </div>
    );
}