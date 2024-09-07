import { getUserAppAccount, getUserProjects, getStagesForProject, getTasks, deleteTask, deleteStage, deleteProject, deleteAppAccountDetails } from "@/lib/db";
import { AppAccount, Project, Stage, Task } from "@/lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest){
    try {
        const user: AppAccount = await getUserAppAccount('66b7eb15ae9367342a8bcb13') as AppAccount;
        const projects: Project[] = await getUserProjects(user) as Project[];

        projects.map(async project => {
            const stages: Stage[] = await getStagesForProject(project._id!.toString()) as Stage[];
            await stages.map(async stage => {
                const tasks: Task[] = await getTasks(stage) as Task[];
                tasks.map(task=>{
                    deleteTask(task._id!.toString());
                })

                deleteStage(stage._id!.toString());
            });
        
            deleteProject(project._id!.toString());
        });

        deleteAppAccountDetails(user._id!.toString());

        return NextResponse.json({message: 'success'});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error creating Comment', error }, { status: 500 });
    }
}