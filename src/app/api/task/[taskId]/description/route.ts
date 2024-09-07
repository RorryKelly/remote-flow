import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { activity } from "../../../../../lib/definitions";
import { createTaskActivityLog, EditTaskDescription } from "../../../../../lib/db";

export async function PUT(request: NextRequest, {params}: {params: { taskId: string }} ) {
    try {
        const {newDescription} = await request.json() as {newDescription: string, taskMetadataId: string};
        const session: Session | null = await auth();

        if(!session){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }

        const response = await EditTaskDescription(newDescription, params.taskId);
       
        const activity: activity = {
            taskId: params.taskId,
            log: `description has been updated to '${newDescription}'`
        }

        createTaskActivityLog(activity);

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error creating Comment', error }, { status: 500 });
    }
}