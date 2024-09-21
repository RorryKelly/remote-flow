import { NextRequest, NextResponse } from 'next/server';
import { Project } from '../../../lib/definitions';
import { createUserProject, getStagesForProject, getUserProjects, getUserProjectsById } from '../../../lib/db';
import { auth } from '@/auth';
import { Session } from 'next-auth';

export async function GET(request: NextRequest){
    try{
        const session: Session | null = await auth();

        if(!session || !session?.user){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }
        
        //to-do implement 
        return NextResponse.json({});
    } catch (error){
        return NextResponse.json({ message: 'Error getting stages', error }, { status: 500 });
    }

}