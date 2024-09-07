'use client'
import { ReactNode } from "react";

interface tabsProps{
    test: any;
    children: any;
}

const Switch: React.FC<tabsProps> = ({test, children})=>{
    return children!.find((child: any)=>{
        return child.props.value == test
    });
}

export default Switch;