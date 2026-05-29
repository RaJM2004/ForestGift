import mongoose, { Document, Schema } from 'mongoose';

export interface IStory extends Document {
  title: string;
  content: string;
  imageUrl: string;
  linkUrl?: string;
  createdAt: Date;
}

const StorySchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Story = mongoose.model<IStory>('Story', StorySchema);
