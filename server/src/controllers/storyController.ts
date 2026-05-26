import { Request, Response } from 'express';
import { Story } from '../models/Story';

export const getStories = async (req: Request, res: Response) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createStory = async (req: Request, res: Response) => {
  try {
    const { title, content, imageUrl, linkUrl } = req.body;
    const newStory = new Story({ title, content, imageUrl, linkUrl });
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Story.findByIdAndDelete(id);
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
