import { getStagesForProject, getTasks } from "@/lib/db";
import { Stage, Task, TaskTableProps } from "@/lib/definitions";
import TaskTable from "./Task-Table";
import styles from '../taskboard.module.css';

interface TaskTableDataProvider{
    projectId: string
}

export default async function TaskTableDataProvider({projectId}: TaskTableDataProvider){
    const stages = await getStagesForProject(projectId!.toString()) as Stage[];
    const taskTableProps: TaskTableProps[] = await createTableProps(stages);    

    return (
        <div  className={styles.taskTable}>
            <TaskTable projectId={projectId} taskTableProps={JSON.stringify(taskTableProps)}  />
        </div>
    )
}

async function createTableProps(stages: Stage[]){
    const taskTableProps: TaskTableProps[] = []

    for(const stage of stages){
        const tasks = await getTasks(stage) as Task[];
        taskTableProps.push({
            stage: stage,
            tasks: tasks
        })
    }
    
    return taskTableProps;
}