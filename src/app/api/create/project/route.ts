import { NextResponse } from 'next/server';
import { Project } from '../../../../../lib/definitions';
import { createUserProject } from '../../../../../lib/db';
import { auth } from '@/auth';
import { Session } from 'next-auth';

export async function POST(request: Request) {
    try {
        const newProj = await request.json() as Project;
        const session: Session | null = await auth();

        if(!session){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }

        newProj.createdBy = session.user?.id as string;
        const response = await createUserProject(newProj);

        if(response != "success"){
            return NextResponse.json({ message: 'Error creating user', response }, { status: 500 });
        }
       
        return NextResponse.json({ message: 'User created successfully'});
    } catch (error) {
        return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
    }
}