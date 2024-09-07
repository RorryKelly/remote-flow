import { NextRequest, NextResponse } from 'next/server';
import { AppAccount, Project } from '../../../lib/definitions';
import { createUserProject, getUserAppAccount, getUserProjects, getUserProjectsById } from '../../../lib/db';
import { auth } from '@/auth';
import { Session } from 'next-auth';

export async function POST(request: NextRequest) {
    try {
        const newProj = await request.json() as Project;
        const session = await auth();

        if(!session){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }

        const response = await createUserProject(newProj);
       
        return NextResponse.json(response, {status: 200});
    } catch (error) {
        return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
    }
}

export async function GET(request: NextRequest){
    try{
        const session: Session | null = await auth();

        if(!session || !session?.user){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }
        
        let projectId = request.nextUrl.searchParams.get("id");
        if(!projectId){
            const appUser = await getUserAppAccount(session.user?.id!) as AppAccount;
            const projects = getUserProjects(appUser);
            return NextResponse.json(projects);
        }

        const results = await getUserProjectsById(projectId);
        if(!results){
            return NextResponse.json({ message: 'No results found. You either do not have permissions to access this, or it does not exist.' }, { status: 404 });
        }

        return NextResponse.json(results);
    } catch (error){
        return NextResponse.json({ message: 'Error getting project', error }, { status: 500 });
    }
}