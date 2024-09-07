import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Session } from 'next-auth';
import { Stage } from '@/lib/definitions';
import { ObjectId } from 'mongodb';
import { getTasks } from '@/lib/db';

export async function GET(request: NextRequest, {params}: {params: { stageId: string }}){
    try{
        const session: Session | null = await auth();

        if(!session || !session?.user){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }
        
        let stageId = params.stageId;

        const results = await getTasks({_id: new ObjectId(stageId!)} as Stage);

        if(!results || results.length <= 0){
            return NextResponse.json({ message: 'No results found. You either do not have permissions to access this, or it does not exist.' }, { status: 404 });
        }

        return NextResponse.json(results);
    } catch (error){
        return NextResponse.json({ message: 'Error getting stages', error }, { status: 500 });
    }

}