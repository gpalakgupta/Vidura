// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const authenticationParameter = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    });

    return Response.json({
      authenticationParameter,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    }); 
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
