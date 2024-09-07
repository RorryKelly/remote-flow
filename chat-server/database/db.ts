import { JoinEventData } from '../events/event';
import JoinEvent from '../events/join-event';
import MessageEvent from '../events/message-event';
import clientPromise from './dbClient';
import { ObjectId } from 'mongodb';

export async function GetSessionInformation(sessionId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection("sessions")
            .findOne({sessionToken: sessionId.toString()});
        
        return result;
    } catch (e) {
        console.log(e);
    }
}

export async function GetAppAccount(userId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection("AppAccounts")
            .findOne({oAuthId: userId});
        
        return result;
    } catch (e) {
        console.log(e);
    }
}

export async function GetUserConversations(userId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection("ConversationUsers")
            .findOne({userId: userId});
    
        return result; 
    } catch (e) {
        console.log(e);
    }
}

export async function GetConversationMessages(chatId: string, userId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const query = await db.collection("ConversationMessages")
            .find({chatId: chatId});
        
        let result = [];        
        while(await query.hasNext()){
            const next = await query.next() as any;
            next.incoming = next.sender != userId;
            result.push(next);
        }
    
        return result; 
    } catch (e){
        console.log(e);
    }
}

export async function GetConversation(chatId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection("Conversation")
            .findOne({_id: new ObjectId(chatId)});
    
        return result?._id.toString(); 
    } catch (e) {
        console.log(e);
    }
}

export async function CreateConversation(event: JoinEvent){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const conversation = {
            chatTitle: event.data.title
        };

        const result = await db.collection("Conversation")
            .insertOne(conversation);

        [event.data.sender, ...event.data.participants || []]
            .filter(user => user != "")
            .map(async (user)=>{
                const conversationUser = {
                    chatId: result.insertedId.toString(),
                    userId: user
                }
                await db.collection("ConversationUsers")
                    .insertOne(conversationUser);
            });
    
        return result.insertedId.toString(); 
    } catch (e) {
        console.log(e);
    }
}

export async function IsUserInConversation(chatId: string, userId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");

        const result = await db.collection("ConversationUsers")
            .findOne({userId: userId, chatId: chatId});
    
        return result != null; 
    } catch (e) {
        console.log(e);
    }
}

export async function JoinConversation(chatId: string, userId: string){
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

export async function GetConversationUsers(chatId: string){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const query = await db.collection("ConversationUsers")
            .find({chatId: chatId});

        let results = [];
        while(await query.hasNext()){
            const temp = await query.next();
            const result = await db.collection("AppAccounts")
                .findOne({_id: new ObjectId(temp!.userId)});
            results.push(result);
        }
    
        return results; 
    } catch (e) {
        console.log(e);
    }
}

export async function SendMessage(event: MessageEvent){
    try{
        const client = await clientPromise;
        const db = client.db("RemoteFlow_Db");
        const message = {
            chatId: event.chatId,
            sender: event.data.sender,
            timestamp: event.data.timestamp,
            message: event.data.message
        }

        const result = await db.collection("ConversationMessages")
            .insertOne(message);
    
        return await db.collection("ConversationMessages")
            .findOne({_id: result.insertedId}); 
    } catch (e) {
        console.log(e);
    }
}