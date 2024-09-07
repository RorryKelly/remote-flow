import { auth } from "@/auth";
import { createTask, createTaskActivityLog, getFirstStageByProject, getUserAppAccount } from "@/lib/db";
import { activity, comment, Stage, Task } from "@/lib/definitions";
import { ObjectId } from "mongodb";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface newTask {
    title: string;
    createdBy?: string;
    stageId?: string;
    assignee?: string;
    comments?: comment[];
    description?: string;
    dueDate?: string;
}

export async function POST(request: NextRequest, {params}: {params: { id: string }}){
    try {
        const {newTask} = await request.json() as {newTask: newTask};
        const projectId: string = params.id;
        const session: Session | null = await auth();

        if(!session){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }

        const firstStage = await getFirstStageByProject(projectId) as Stage;
        const task = newTask as Task;
        task.dueDate = new Date(newTask.dueDate!);
        const createdByUser = await getUserAppAccount(session.user?.id!);
        const response = await createTask(task, firstStage._id?.toString()!, createdByUser!._id!.toString()) as ObjectId;
       
        const activity: activity = {
            taskId: response.id.toString(),
            log: `Activity created by - ${createdByUser?.firstName} ${createdByUser?.lastName}`
        }

        createTaskActivityLog(activity);

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error creating Comment', error }, { status: 500 });
    }
}