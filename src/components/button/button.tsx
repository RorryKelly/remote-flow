'use client'

interface buttonProps{
    text: string,
    action: any
}
export default function Button({text, action}: buttonProps){
    return (
        <button onClick={action}>{text}</button>
    )
}