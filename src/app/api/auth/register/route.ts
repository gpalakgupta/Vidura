import { error } from "console";
import { connectToDB } from "../../../../../lib/db";
import {User} from "../../../../../models/User";

import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest){
    try{
       const {email,password} = await request.json();
       if(!email || !password){
        return NextResponse.json({error:"Email and password are required"},{status:400});
       }
       await connectToDB();
       const existingUser = await User.findOne({email})
       if(existingUser){
        return NextResponse.json({
            error:"User already exists"
        },{status:400})
       }
    
    await User.create({email,password});
    return NextResponse.json({message:"User registration successfully"},{status:201});
    }catch(err){
        console.log(err);
       return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}