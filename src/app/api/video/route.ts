import { get, request } from "http";
import { connectToDB } from "../../../../lib/db";
import { IVideo, Video } from "../../../../models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try{
        await connectToDB();
        const videos = await Video.find().sort({createdAt:-1}).lean();
        if(!videos || videos.length === 0){
            return Response.json({error:"No videos found"},{status:404});
        }
        return Response.json({videos},{status:200});
    }
    catch(err){
        console.log(err);
        return Response.json({error:"Internal Server Error"},{status:500});
    }
}

export async function POST(request:NextRequest){
    try{
        const session = await getServerSession();
        if(!session){
            return Response.json({error:"Unauthorized"},{status:401});
        }
        await connectToDB();
        const body:IVideo = await request.json();
        if(
            !body.title ||
            !body.desription ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return Response.json({error:"All fields are required"},{status:400});   
        }
        const videoData:IVideo = {
            ...body,
            controls:body ?. controls ?? true,
            transitions:{
                height:1920,
                width:1080,
                quality:body.transitions ?. quality ?? 100,
            },
        };
        const newVideo = await Video.create(videoData)
        return NextResponse.json({message:"Video created successfully",video:newVideo},{status:201});
    }
    catch(err){
        console.log(err);
        return Response.json({error:"Failed to create video"},{status:500});
    }
}