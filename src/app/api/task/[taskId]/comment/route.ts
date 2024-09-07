import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { comment, activity } from "../../../../../lib/definitions";
import { createNewComment, createTaskActivityLog, GetTasksComments } from "../../../../../lib/db";
import parseJson from "@/components/json/parser";

export async function POST(request: NextRequest, {params}: {params: { taskId: string }} ) {
    try {
        console.log('project route: ' + JSON.stringify(request));
        const json = await request.text()
        const newComment = parseJson<comment>(json)
        const session: Session | null = await auth();

        if(!session){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }

        newComment.author = session.user?.name as string;
        const response = await createNewComment(newComment);

        const activity: activity = {
            taskId: params.taskId,
            log: `${newComment.author} created a comment: ${newComment.statement}`
        }

        createTaskActivityLog(activity);
       
        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error creating Comment', error }, { status: 500 });
    }
}

export async function GET(request: NextRequest){
    try{
        const session: Session | null = await auth();

        if(!session || !session?.user){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }
        
        let taskMetadataId = request.nextUrl.searchParams.get("taskMetadataId");
        if(!taskMetadataId){
            return NextResponse.json({ message: 'no task Id given.' }, { status: 400 })
        }

        const results = await GetTasksComments(taskMetadataId) as comment[];
        if(!results || results.length <= 0){
            return NextResponse.json({ message: 'No results found. You either do not have permissions to access this, or it does not exist.' }, { status: 404 });
        }

        return NextResponse.json(results);
    } catch (error){
        return NextResponse.json({ message: 'Error getting project', error }, { status: 500 });
    }
}