import { getStagesForProject, getUserProjects, getUserProjectsById } from "../../../../lib/db";
import { redirect } from 'next/navigation'
import { auth } from "@/auth";
import styles from "./taskboard.module.css";
import { StageSegment } from "./task-selector/stageSegment";
import { Project, Stage } from "../../../../lib/definitions";
import { TaskDetails } from "./taskDetails";
import CreateTask from "./task-selector/createTaskModal";
import TaskTable from "./task-selector/Task-Table";
import TaskTableDataProvider from "./task-selector/taskTableDataProvider";


interface taskboardProps {
    searchParams: { [key: string]: string | string[] | undefined }
    params: { projectId: string }
}

export default async function TaskBoard({searchParams, params}: taskboardProps){
    const session = await auth();
    if(!session || !session?.user){
        return (<></>);
    }

    const projectId = params.projectId;
    let projectName;
    if(projectId){
       const project = await getUserProjectsById(projectId) as Project;
       projectName = project.title;
    }

    return (
        <>
            <div className={styles.taskView}>
                <div className={styles.taskSelector}>
                    <div className={styles.header}>
                        <h1 className='subHeader'>Active Tasks</h1>
                        <CreateTask projectId={projectId} />
                    </div>

                    <TaskTableDataProvider projectId={projectId}/>
                </div>

                {searchParams['taskid'] && (
                    <TaskDetails projectName={projectName} projectId={projectId} currentUser={session.user} taskId={searchParams['taskid'] as string} />
                )}
            </div>
        </>
    )
}