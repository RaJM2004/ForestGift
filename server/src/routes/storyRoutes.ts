import express from 'express';
import { getStories, createStory, deleteStory } from '../controllers/storyController';

const router = express.Router();

router.get('/', getStories);
router.post('/', createStory);
router.delete('/:id', deleteStory);

export default router;
