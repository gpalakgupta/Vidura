"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { set } from "mongoose";
import { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess : (res:any) => void
    onProgress : (progress: number) => void
    fileType?: "image" | "video"
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileType,
} : FileUploadProps) => {
     const [uploading,setUploading] = useState(false);
     const [error,setError] = useState<string | null>(null);

    //  optional validation
    const validateFile = (file : File)=>{
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError("Please upload a video file");
            }
        }
       if(file.size > 0 * 1024 * 1024){
        setError("File size should be less than 100MB");
       }
       return true;
    }

    const handleFileChange = async (e:React.
        ChangeEvent<HTMLInputElement>) =>{
            const file = e.target.files?.[0];
            if(!file || !validateFile(file)){
                return;
            }
            setUploading(true)
            setError(null)
            try{
                const authRes = await fetch("/api/auth/imageKit-auth");
                const auth = await authRes.json();
                const res = await upload({
                // Authentication parameters
               
                file,
                fileName: file.name,
                publicKey: process.env.Next_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire:auth.expire,
                token:auth.token,
              
                onProgress: (event) => {
                    if(event.lengthComputable && onProgress){
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                },
                 
            });
            onSuccess(res);
            }
            catch(err){
                console.error("upload error", err); 
            }
            finally{
                setUploading(false);
            }
        }

    
 
    

    return (
        <>
            <input type="file" 
            accept={fileType  === "video" ? "video/*" : "image/*"}
            onChange={handleFileChange}
            />
            {uploading && (
                <span>Loading....</span>
            )}
        </>
    );
};

export default FileUpload;