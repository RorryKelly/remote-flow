import { auth } from "@/auth";
import { assignTaskToUser } from "@/lib/db";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, {params}: {params: { id: string, taskId: string, userId: string }}){
    try{
        const session: Session | null = await auth();
        
        if(!session){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }

        const response = await assignTaskToUser(params.taskId, params.userId);

        return NextResponse.json(response);
    }catch(e){
        console.log(e);
        return NextResponse.json({ message: 'Error assigning task to user', e }, { status: 500 });
    }
}