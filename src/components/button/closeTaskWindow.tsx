'use client'

import { useRouter } from "next/navigation";
import Button from "./button";

export default function CloseTaskWindow(){
    const router = useRouter();
    return (
        <Button text="X" action={()=>{
            router.replace('task-board');
        }} />
    )
}