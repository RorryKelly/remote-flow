import { auth } from "@/auth";
import { getAssignedUsersForProject } from "@/lib/db";
import { AppAccount } from "@/lib/definitions";
import { NextApiRequest } from "next";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: { id: string }}) {
    try {
        const session: Session | null = await auth();
        console.log(params);

        const results = await getAssignedUsersForProject(params.id);

        if(!results || results.length <= 0){
            return NextResponse.json({ message: 'No results found. You either do not have permissions to access this, or it does not exist.' }, { status: 404 });
        }

        return NextResponse.json(results);
    } catch (e) {
        return NextResponse.json({ message: 'Error getting project users', e }, { status: 500 });
    }
}

