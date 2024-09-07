import Loading from "@/components/loading/loading";
import styles from './signedIn.module.css';
import { auth } from "@/auth";
import { getUserAppAccount, getUserProjects } from "@/lib/db";
import { AppAccount, Project } from "@/lib/definitions";
import { redirect } from "next/navigation";

export default async function SignedIn(){
    const session = await auth();
    if(!session?.user?.id){
        //to-do: redirect to error page.
        return
    }
    const appAccount = await getUserAppAccount(session?.user?.id) as AppAccount;

    if(appAccount){
        const projects = await getUserProjects(appAccount) as Project[];
        if(projects.length <= 0){
            redirect('/onboard');
        }
        redirect(`/project/${projects[0]?._id?.toString()}/task-board`);
    } else {
        redirect('/onboard');
    }


    return (
        <div className={styles.view}>
            <Loading />
        </div>
    );
}