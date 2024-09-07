import { MutableRefObject } from "react";

export default function clickCheck(modalRef: MutableRefObject<any>, showModal: boolean, setShowModal: React.Dispatch<React.SetStateAction<boolean>>){
    window.addEventListener("mousedown", (event)=>{
        checkClick(event, modalRef, showModal, setShowModal)
    });

    return () => {
        window.removeEventListener("mousedown", (event)=>{
            checkClick(event, modalRef, showModal, setShowModal)
        });
    };
}

function checkClick(event: MouseEvent, modalRef: MutableRefObject<any>, showModal: boolean, setShowModal: React.Dispatch<React.SetStateAction<boolean>>){
    const wasModalClicked = event.composedPath().includes(modalRef.current!);
    if(showModal && !wasModalClicked){
        setShowModal(false);
    }else if(!showModal && wasModalClicked){
        setShowModal(true);
    }
}