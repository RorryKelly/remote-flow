import { auth } from "@/auth";
import { createTaskActivityLog, getStageById, updateTaskStage } from "@/lib/db";
import { Stage, activity } from "@/lib/definitions";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest, {params}: {params: { id: string, taskId: string, stageId: string }}){
    try{
        const session = await auth();
        if(!session){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }
        
        const {taskId, stageId} = params;
        const result = updateTaskStage(taskId, stageId);

        if(!result){
            return NextResponse.json({message: 'something went wrong. Try again later'}, { status: 500 })
        }

        const stage = await getStageById(stageId) as Stage;
        const activity: activity = {
            taskId: taskId,
            log: `Task moved to stage ${stage.title}`
        }

        createTaskActivityLog(activity);

        return NextResponse.json(result, { status: 200 })
    }catch(e){
        console.log(e);
        return NextResponse.json({ message: 'Error when updating stage', e }, { status: 500 });
    }
}