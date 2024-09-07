import { auth } from "@/auth";
import { Session } from "next-auth";
import { getFirstStageByProject, getUserAppAccount, createTask, createTaskActivityLog, createAccountDetails, createUserProject, assignUserToProject } from "@/lib/db";
import { AppAccount, Project, Stage, Task } from "@/lib/definitions";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, {params}: {params: { id: string }}){
    try {
        const user = {
            firstName: 'test',
            lastName: 'user',        
            sharecode: '4427',
            oAuthId: '66b7eb15ae9367342a8bcb13'
        } as AppAccount;

        const userId = await createAccountDetails(user);

        const tasks = [
            {
                title: "Implement User Authentication and OAuth Integration",
                createdBy: "66c112df4226f647f5ee5456",
            },
            {
                title: "Design and Develop Mobile-Responsive Dashboard",
                createdBy: "66c112df4226f647f5ee5456",
            },
            {
                title: "Optimize Backend API for Real-Time Data Processing",
                createdBy: "66c112df4226f647f5ee5456",
            },
            {
                title: "Create Automated Testing Suite for E-commerce Module",
                createdBy: "66c112df4226f647f5ee5456",
            },
        ];
        
        const stages = [
            {
                title: "To do",
                pos: 1,
                icon: "FaRegClock",
                tasks: tasks
            },
            {
                title: "Doing",
                pos: 2,
                icon: "FaRegCircle",
            },
            {
                title: "Done",
                pos: 3,
                icon: "FaRegCheckCircle",
            }
        ];

        const project = {
            _id: new ObjectId('66c112e44226f647f5ee5457'),
            title: 'Cypress Project',
            createdBy: userId.toString(),
            stages: stages
        } as Project;

        const projectId = await createUserProject(project);

        await assignUserToProject(userId.toString(), projectId.toString());
        
        return NextResponse.json(projectId);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error creating Comment', error }, { status: 500 });
    }
}