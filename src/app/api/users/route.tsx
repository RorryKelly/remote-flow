import { auth } from "@/auth";
import { getUserAppAccountByName } from "@/lib/db";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session: Session | null = await auth();
        const firstName = req.nextUrl.searchParams.get("firstName");
        const lastName = req.nextUrl.searchParams.get("lastName");
        const sharecode = req.nextUrl.searchParams.get("sharecode");

        if(!firstName || !lastName || !sharecode){
            return NextResponse.json({ message: 'Invalid request, please enter all required fields: firstName, lastName, sharecode' }, { status: 400 });
        }

        const results = await getUserAppAccountByName(firstName, lastName, sharecode);

        if(!results){
            return NextResponse.json({ message: 'No results found. You either do not have permissions to access this, or it does not exist.' }, { status: 404 });
        }

        return NextResponse.json("fdsaf");
    } catch (e) {
        return NextResponse.json({ message: 'Error getting project users', e }, { status: 500 });
    }
}