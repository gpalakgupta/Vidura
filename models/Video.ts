import mongoose, { Schema, model, models, mongo } from "mongoose";

export const VIDEO_DIMENSIONS = {
  WIDTH: 1080,
  HEIGHT: 1920,
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  desription?: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transitions?: {
    height: number;
    width: number;
    quality?: number;
  };
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    desription: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transitions: {
      height: { type: Number, default: VIDEO_DIMENSIONS.HEIGHT },
      width: { type: Number, default: VIDEO_DIMENSIONS.WIDTH },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);


 

export const Video = models?.Video || model<IVideo>("Video", videoSchema);