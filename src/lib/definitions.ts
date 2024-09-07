import { ObjectId } from "mongodb";

export interface Project {
    _id: ObjectId | undefined;
    title: string;
    description: string;
    createdBy: string;
    creationDate: Date;
    stages: string[] | Stage[] | null;
    tasks: Task[];
}

export interface AssignedProject{
    _id?: ObjectId | undefined;
    userId: ObjectId | undefined;
    projectId: ObjectId | undefined;
}

export interface AppAccount {
    _id?: ObjectId | undefined;
    firstName?: string;
    lastName?: string;
    image?: string;
    sharecode?: string;
    oAuthId?: string;
}

export interface Stage {
    _id?: ObjectId | undefined;
    title: string;
    pos: number;
    icon: string;
    tasks: Task[] | null;
    projectId: string;
}

export interface Task {
    _id?: ObjectId | undefined;
    title: string;
    createdBy?: string;
    stageId?: string;
    assignee?: string;
    comments?: comment[];
    description?: string;
    dueDate?: Date;
    activity?: activity[];
}

export interface comment{
    _id?: ObjectId | undefined;
    author: string;
    statement: string;
    createdAt?: Date | string;
    lastUpdated?: Date | string;
    taskId: string;
}

export interface activity{
    _id?: ObjectId | undefined;
    taskId: string;
    log: string;
}

export interface TaskTableProps{
    stage: Stage,
    tasks: Task[],
}

export interface ConversationDetails{
    _id?: ObjectId, 
    chatTitle: string
}

export interface ConversationMessage{
    icon: string,
    message: string,
    timestamp: Date,
    sender: string,
    incoming: boolean,
}

export interface MessageEvent{
    icon?: string,
    actionType: string,
    data: {
        message: string,
        timestamp: Date,
        sender: string,
        incoming: boolean,
    }
}