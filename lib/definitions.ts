export interface Project {
    title: string;
    description: string;
    createdBy: string;
    creationDate: Date;
    stages: string[];
    tasks: string[];
}

export interface AppAccount {
    firstName: string;
    lastName: string;
    image: string;
    sharecode: string;
    oAuthId: string;
}