import { NextAuthOptions } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
import CredentialProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectToDB();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with the given email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }
          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (err) {
          console.log(err);
          throw new Error("Internal Server Error");
        }
      },
    }),
  ],
  callbacks:{
    async jwt({token,user}){
        if(user){
            token.id = user.id;
        }
        return token;
    },
     async session({session,token}){
        if(session.user){
            session.user.id = token.id as string;
        }
        return session;
    },
  },
  pages:{
    signIn:"/login",
    error:"/login",
  },
  session:{
    strategy:"jwt",
    maxAge:30*24*60*60, // 30 days
  },
  secret:process.env.NEXTAUTH_SECRET,
};
