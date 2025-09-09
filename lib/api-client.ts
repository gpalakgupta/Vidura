"use client"
import { IVideo } from "../models/Video";

export type VideoFormData = Omit<IVideo,"_id">

type FetchOptions = {
    method? : "GET" | "POST" | "PUT" | "DELETE",
    body? : any,
    headers? : Record<string, string>
}

class ApiClient {
    private async Fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const {method = "GET", body, headers = {}} = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        };
       const response = await fetch(`/api${endpoint}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: defaultHeaders
        });
        if(!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }
         return response.json() as Promise<T>;
    }

    async getVideos(){
        return this.Fetch('/videos');
    }
    async createVideo(videoData : VideoFormData){
        return this.Fetch('/videos', {
            method: 'POST',
            body: videoData
        });
    }
}

export const apiClient = new ApiClient();