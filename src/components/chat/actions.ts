'use server'

import { auth } from "@/auth";
import { CreateConversation, GetConversation, getUserAppAccount, GetUserConversations } from "@/lib/db";
import { AppAccount, ConversationDetails } from "@/lib/definitions";
import { ObjectId } from "mongodb";
import { Session } from "next-auth";

export async function FetchUserConversations(){
    const session: Session | null = await auth();
    if(session?.user?.id){
        const account = await getUserAppAccount(session.user.id.toString());
        const conversations = await GetUserConversations(account!._id!.toString());
        
        return JSON.stringify(conversations);
    }
}

export async function FetchConversation(chatId: string){
    let conversation = await GetConversation(new ObjectId(chatId));
    if(conversation){
        return conversation as ConversationDetails;
    }
    return undefined;
}

export async function CreateNewConversation(chatTitle: string, users: AppAccount[]){
    const session: Session | null = await auth();
    if(!session?.user?.id){
        return;
    }

    const account = await getUserAppAccount(session.user.id.toString()) as AppAccount;

    if(!account){
        return;
    }

    users.push(account);
    return await CreateConversation(chatTitle, users);
}