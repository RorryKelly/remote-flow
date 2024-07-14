import { getUserProjects } from "../../../lib/db";
import { redirect } from 'next/navigation'
import { auth } from "@/auth";

export default async function Home(){
    const session = await auth();
    if(!session || !session?.user){
        redirect('/');
    }

    const userProjects = await getUserProjects(session?.user);
    console.log(userProjects);
    if(userProjects?.length == 0){
        redirect('/create/project');
    }

    return (
        <>
            TEST WORKING
        </>
    )
}