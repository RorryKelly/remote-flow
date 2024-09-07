'use client'

import { Children, useState } from "react"
import { Project } from "../../lib/definitions"
import React from "react";


export const SegmentRenderer = ({ children }: any) => {
    const [currentScreen, setCurrentScreen] = useState<number>(0);
    const [projectDetails, setProjectDetails] = useState<Project>({title: 'Test Project'} as Project);
    
    const currentChild = Children.toArray(children)[currentScreen] as React.ReactElement;
    return (
        <>
            {React.cloneElement(currentChild, {
                setCurrentScreen: setCurrentScreen,
                setProjectDetails: setProjectDetails,
                projectDetails: projectDetails,
            })}
        </>
    );
}