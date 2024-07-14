import { NextResponse } from 'next/server';
import { AppAccount } from '../../../../../lib/definitions';
import { createAccountDetails } from '../../../../../lib/db';
import { auth } from '@/auth';
import { Session } from 'next-auth';

export async function POST(request: Request) {
    try {
        // Parse the request body
        const appAccount = await request.json() as AppAccount;
        const session: Session | null = await auth();

        if(!session){
            return NextResponse.json({ message: 'user unauthorised, try signing in' }, { status: 401 })
        }

        appAccount.oAuthId = session.user?.id as string;
        const response = await createAccountDetails(appAccount);

        if(response != "success"){
            console.log(response);
        }
       
        // Respond with a success message
        return NextResponse.json({ message: 'Account created successfully'});
    } catch (error) {
        // Handle errors and respond with an error message
        return NextResponse.json({ message: 'Error creating Account', error }, { status: 500 });
    }
}