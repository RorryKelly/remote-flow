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
        
        let stageId = request.nextUrl.searchParams.get("id");
        let projectId = request.nextUrl.searchParams.get("projectId");

        if(projectId){
            const stages = await getStagesForProject(projectId)
            return NextResponse.json(stages);
        }

        if(!stageId){
            const stages = getUserProjects(session.user);
            return NextResponse.json(stages);
        }

        const results = await getUserProjectsById(stageId);
        if(!results || results.length <= 0){
            return NextResponse.json({ message: 'No results found. You either do not have permissions to access this, or it does not exist.' }, { status: 404 });
        }

        return NextResponse.json(results);
    } catch (error){
        return NextResponse.json({ message: 'Error getting stages', error }, { status: 500 });
    }

}