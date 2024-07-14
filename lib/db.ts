import { AdapterUser } from 'next-auth/adapters';
import { User } from 'next-auth';
import clientPromise from './dbClient';
import {  AppAccount, Project } from './definitions';

export async function getUserProjects(user: User | AdapterUser){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const query = db.collection("Project")
            .find({createdBy: user.id});
        let results = [];

        while(await query.hasNext()){
            const temp = await query.next();
            results.push(temp);
        }
        
        return results;
    } catch (e) {
        console.log(e);
    }
}

export async function createAccountDetails(account: AppAccount){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const collection = db.collection("user");
        collection.insertOne(account);
        return "success";
    } catch (e) {
        return "error when saving new user: " + e;
    }
}

export async function createUserProject(project: Project){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const collection = db.collection("Project");
        collection.insertOne(project);
        return "success";
    } catch (e) {
        console.log('err: ' + e);
        return "error when saving new user: " + e;
    }
}