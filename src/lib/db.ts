import { AdapterUser } from 'next-auth/adapters';
import { Account, User } from 'next-auth';
import clientPromise from './dbClient';
import {  activity, AppAccount, AssignedProject, comment, ConversationDetails, Project, Stage, Task } from './definitions';
import { ObjectId } from 'mongodb';

// Projects
export async function getUserProjects(user: AppAccount){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const query = await db.collection<AssignedProject>("ProjectUsers")
            .find({userId: user._id});
        let results = [];
        while(await query.hasNext()){
            const temp = await query.next();
            const result = await getUserProjectsById(temp?.projectId?.toString()!);
            results.push(result);
        }
        
        return results;
    } catch (e) {
        console.log(e);
    }
}

export async function getAssignedUsersForProject(projectId: string): Promise<AppAccount[] | undefined> {
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const objectId = new ObjectId(projectId);

        const query = db.collection<AssignedProject>("ProjectUsers")
            .find({projectId: objectId});
        let results = [];

        while(await query.hasNext()){
            const temp = await query.next();
            const result = await GetAppAccountDetails(temp?.userId?.toString()!) as AppAccount;
            results.push(result);
        }
        
        return results;
    } catch (e) {
        console.log(e);
    }
}

export async function assignUserToProject(userId: string, projectId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const userProject: AssignedProject = {
            userId: new ObjectId(userId),
            projectId: new ObjectId(projectId),
        }

        const collection = db.collection("ProjectUsers");
        const results = await collection.insertOne(userProject);

        return "success";
    }catch (e){
        console.log(e);
    } 
}

export async function getUserProjectsById(id: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const objectId = new ObjectId(id);

        const query = await db.collection("Projects")
            .findOne({_id: objectId});
        let results = query as Project;
        
        return results;
    } catch (e) {
        console.log(e);
    }
}

export async function createUserProject(project: Project){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const stages = project.stages as Stage[];
        project.stages = null;

        const collection = db.collection("Projects");
        const results = await collection.insertOne(project);
        const projectId = results.insertedId;
        if(stages){
            stages.map(stage=>{
                createStage(stage, projectId.toString(), project.createdBy)
            })
        }

        return projectId;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

export async function deleteProject(projectId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const deleteProjectUsers = await db.collection<Project>("ProjectUsers")
            .deleteMany({projectId: new ObjectId(projectId)});
        const deleteProject = await db.collection<Project>("Projects")
            .deleteOne({_id: new ObjectId(projectId)});
        
        return deleteProject;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

//account
export async function createAccountDetails(account: AppAccount){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const collection = db.collection("AppAccounts");
        const createdAccount = await collection.insertOne(account);
        return createdAccount.insertedId;
    } catch (e) {
        return "error when saving new user: " + e;
    }
}

export async function GetAppAccountDetails(userId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const objectId = new ObjectId(userId);
        console.log(objectId);

        const result = await db.collection("AppAccounts")
            .findOne<AppAccount>({_id: objectId});
        
        return result;
    }catch (e){
        console.log(e);
    } 
}

export async function deleteAppAccountDetails(userId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection<AppAccount>("AppAccounts")
            .deleteOne({_id: new ObjectId(userId)});
        
        return result;
    }catch (e){
        console.log(e);
    } 
}

export async function getUserAppAccount(oAuthId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection("AppAccounts")
            .findOne<AppAccount>({oAuthId: oAuthId});
        
        return result;
    }catch (e){
        console.log(e);
    } 
}

export async function getUserAppAccountByName(firstName: string, lastName: string, sharecode: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const result = await db.collection("AppAccounts")
            .findOne<AppAccount>({firstName: firstName, lastName: lastName, sharecode: sharecode});

        return result;
    } catch (e){
        console.log(e);
    }
}

//stage
export async function createStage(stage: Stage, projectId: string, createdById: string){
    try{
        console.log(stage);
        const tasks = stage.tasks as Task[];
        stage.tasks = null;
        stage.projectId = projectId;
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");


        const collection = db.collection("Stages");
        const result = await collection.insertOne(stage);

        if(tasks){
            tasks.map(task=>{
                createTask(task, result.insertedId.toString(), createdById);
            })
        }

        return result.insertedId;
    }catch (e){
        console.log(e);
        return "error when saving new stage: " + e;
    }
}

export async function deleteStage(stageId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const deleteStage = await db.collection<Stage>("Stages")
            .deleteOne({_id: new ObjectId(stageId)});
        
        return deleteStage;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

export async function getStagesForProject(projectId: string) : Promise<Stage[] | string>{
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const objectId = new ObjectId(projectId);

        const resultStage = await db.collection<Stage>("Stages")
            .find({projectId: objectId.toString()}).toArray();
        
        return resultStage;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

export async function getFirstStageByProject(projectId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const resultStage = await db.collection<Stage>("Stages")
            .findOne({projectId: projectId},
                    { sort: { pos: 1 } });

        return resultStage;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

export async function getStageById(stageId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const resultStage = await db.collection<Stage>("Stages")
            .findOne({_id: new ObjectId(stageId)});

        return resultStage;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

//tasks
export async function getTasks(stage: Stage){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const resultProject = await db.collection<Task>("Tasks")
            .find({stageId: stage._id?.toString()}).toArray();
        
        return resultProject;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

export async function getTaskById(id: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const resultTask = await db.collection<Task>("Tasks")
            .findOne({_id: new ObjectId(id)});
        
        return resultTask;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

export async function createTask(task: Task, stageId: string, createdById: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        task.stageId = stageId;
        task.createdBy = createdById

        const collection = db.collection("Tasks");
        const result = await collection.insertOne(task);

        return result.insertedId;
    }catch (e){
        console.log(e);
        return "error when saving new stage: " + e;
    }
}

export async function updateTaskStage(taskId: string, stageId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const collection = db.collection("Tasks");
        const result = await collection.updateOne({_id: new ObjectId(taskId)}, {$set: {stageId: stageId}})
        
        return result;
    } catch (e){
        console.log(e);
    }
}

export async function createNewComment(newComment: comment){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");


        const collection = db.collection("Comments");
        const result = await collection.insertOne(newComment);
        
        return result.insertedId;
    }catch (e){
        console.log(e);
        return "error when saving new stage: " + e;
    }
}

export async function GetTasksComments(taskId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const resultTask = await db.collection<comment>("Comments")
            .find({taskId: taskId}).toArray();
        
        return resultTask;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

export async function deleteTask(taskId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const deleteComments = await db.collection<comment>("Comments")
            .deleteMany({taskId: taskId});

        const deleteActivity = await db.collection<activity>("Activity")
            .deleteMany({taskId: taskId});
        const deleteTask = await db.collection<Task>("Tasks")
            .deleteOne({_id: new ObjectId(taskId)});
        
        return deleteTask;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

export async function EditTaskDescription(newDescription: string, taskId: string){
    try{
        const client = await clientPromise; 
        const db = client.db("RemoteFlow_Db");
        const taskMetadata = await db.collection("Tasks")
        const result = await taskMetadata.updateOne({_id: new ObjectId(taskId)}, {$set: {description: newDescription}})
        return result;
    }catch (e){
        console.log('err: ' + e);
        return "error when trying to update new description: " + e;
    }
}

export async function createTaskActivityLog(activity: activity){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");


        const collection = db.collection("Activity");
        const result = await collection.insertOne(activity);
        
        return result.insertedId;
    }catch (e){
        console.log(e);
        return "error when saving new stage: " + e;
    }
}

export async function getTaskActivities(taskId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const resultTask = await db.collection<activity>("Activity")
            .find({taskId: taskId}).toArray();
        
        return resultTask;
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}

export async function assignTaskToUser(taskId: string, userId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const collection = db.collection("Tasks");
        const result = await collection.updateOne({_id: new ObjectId(taskId)}, {$set: {assignee: userId}})
        
        return result;
    } catch (e) {
        console.log('err: ' + e);
        return "error when trying to assign task to user: " + e;
    }
}

export async function updateDueDate(dueDate: Date, taskId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const collection = db.collection("Tasks");
        const result = await collection.updateOne({_id: new ObjectId(taskId)}, {$set: {dueDate: dueDate}})
        
        return result;
    } catch (e) {
        console.log('err: ' + e);
        return "error when trying to assign task to user: " + e;
    }
}

export async function GetUserConversations(userId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const query = await db.collection("ConversationUsers")
            .find({userId: userId});

        let result = [] as {
            _id?: any,
            chatTitle: string, 
        }[];

        while(await query.hasNext()){
            const next = await query.next() as {
                _id?: any,
                chatId: string,  
                userId: string 
            };

            console.log(next);


            const conversation = await GetConversation(new ObjectId(next.chatId)) as {
                _id?: any,
                chatTitle: string, 
            };
            result.push(conversation);
        }
    
        return result; 
    } catch (e) {
        console.log(e);
    }
}

export async function GetConversation(chatId: ObjectId){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection<ConversationDetails>("Conversation")
            .findOne({_id: chatId});
    
        return result; 
    } catch (e) {
        console.log(e);
    }
}

export async function CreateConversation(title: string, participants: AppAccount[]){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection("Conversation")
            .insertOne({chatTitle: title});

        for(let participant of participants){
            AddToConversation(result.insertedId.toString(), participant._id!.toString());
        }
    
        return result; 
    } catch (e) {
        console.log(e);
    }
}

export async function AddToConversation(chatId: string, userId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection("ConversationUsers")
            .insertOne({userId: userId, chatId: chatId});
    
        return result; 
    } catch (e) {
        console.log(e);
    }
}