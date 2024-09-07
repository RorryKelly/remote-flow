import { GetAppAccountDetails, getStageById, getTaskActivities, getTaskById, GetTasksComments, updateDueDate } from "../../../../lib/db";
import { activity, AppAccount, comment, Stage, Task } from "../../../../lib/definitions";
import styles from "./taskboard.module.css";
import DescriptionEditor from "../../../../components/editor/descriptionEditor";
import Tabs from "../../../../components/tabs/tabs";
import Comments from "../../../../components/comments/comments";
import { User } from "next-auth";
import { FaProjectDiagram, FaUserEdit, FaUser, FaSpinner } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import Activity from "@/components/activity/activity";
import CloseTaskWindow from "@/components/button/closeTaskWindow";
import InlineAssignEditor from "@/components/editor/inlineEditor";
import InlineDatePicker from "@/components/datePicker/inlineDatePicker";

interface taskDetailsProps {
    projectName: string | undefined,
    projectId: string,
    taskId: string,
    currentUser: User
}

export async function TaskDetails({projectName, projectId, taskId, currentUser}: taskDetailsProps){
    const task = await getTaskById(taskId) as Task;
    const stage = await getStageById(task.stageId!) as Stage;
    const comments: comment[] = await GetTasksComments(task._id!.toString()) as comment[];
    const activities: activity[] = await getTaskActivities(taskId) as activity[];
    const createdBy: AppAccount = await GetAppAccountDetails(task.createdBy!) as AppAccount;
    let assignee: AppAccount | undefined;
    if(task.assignee){
        assignee = await GetAppAccountDetails(task.assignee) as AppAccount;
    }

    const changeDueDate = async (dueDate: Date, taskId: string) => {
        'use server'
        updateDueDate(dueDate, taskId);
    }

    return (
        <div id="taskDetails" className={styles.taskDetails}>
            <span className={styles.detailsHeader}>
                <h1 className="header">{task.title}</h1>
                <CloseTaskWindow />
            </span>
            <div className={styles.information}>
                <span>
                    <b>Assignee</b> 
                    <span style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <span className={styles.iconContainer}><FaUser size={'1.5rem'}/></span>
                        <InlineAssignEditor taskId={taskId} projectId={projectId} assigneeJSON={JSON.stringify(assignee)}/>
                    </span>
                </span>
                <span>
                    <b>Created By</b> 
                    <span style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <span className={styles.iconContainer}><FaUserEdit size={'1.75rem'}/></span>
                        <p>{createdBy?.firstName} {createdBy?.lastName}</p>
                    </span>
                </span>
                <span>
                    <b>Due Date</b> 
                    <span style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <span className={styles.iconContainer}><MdOutlineDateRange size={'1.75rem'}/></span>
                        <InlineDatePicker handleSubmit={changeDueDate} taskId={taskId} initDate={task.dueDate!} />
                    </span>
                </span>
                <span>
                    <b>Project</b> 
                    <span style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <span className={styles.iconContainer}><FaProjectDiagram size={'1.5rem'}/></span>
                        <p>{projectName}</p>
                    </span>
                </span>
                <span>
                    <b>Current Stage</b> 
                    <span style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <span className={styles.iconContainer}><FaSpinner size={'1.5rem'}/></span>
                        <p>{stage.title}</p>
                    </span>
                </span>

                <b>Description</b>
                <DescriptionEditor taskId={taskId} description={task.description!} />

                <Tabs headers={['Comments', 'Activity']}>
                    <Comments value={0} taskId={taskId} currentUser={currentUser.name!} comments={JSON.stringify(comments)} />
                    <Activity value={1} activitiesJson={JSON.stringify(activities)} />
                </Tabs>

            </div>
        </div>
    );
}