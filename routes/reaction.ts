import { Router, Request, Response } from 'express';
import Reaction from '../models/reaction';

const router = Router();

// Add a Reaction
router.post('/notification-reaction', async (req: Request, res: Response) => {
  try {
    const { react, postId, name, email } = req.body;

    // Create and save the new reaction
    const reactionData = new Reaction({
      react,
      postId,
      name,
      email,
    });

    const result = await reactionData.save();
    res.status(200).send({ message: 'Reaction added successfully', data: result });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).send({ error: 'Failed to add reaction' });
  }
});

// Get Reactions by Post ID
router.get('/notification-reaction/:id', async (req: Request, res: Response) => {
  try {
    const { id: postId } = req.params;
    const reactions = await Reaction.find({ postId }).exec();

    res.status(200).send({ reactions });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).send({ error: 'Failed to fetch reactions' });
  }
});

export default router;
