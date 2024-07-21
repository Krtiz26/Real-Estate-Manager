"use server"

import { revalidatePath } from "next/cache";
import User from "@/app/lib/models/user.model"
import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
    try {
      connectToDB();
  
      return await User.findOne({ id: userId }).populate({
        path: "communities",
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

interface Params {
    userId: string;
    username: string;
    name: string;
    image: string;
    account_type: string;
    path: string;
}

export async function updateUser({
    
    userId,
    username,
    name,
    image,
    account_type,
    path,

}: Params): Promise<void> {
    connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId },
            { 
                username: username.toLowerCase(),
                name,
                image,
                account_type,
                onboarded: true,
            },
            { upsert: true }
        );
    
        if(path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}