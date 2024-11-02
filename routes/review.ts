import { Router, Request, Response } from 'express';
import Review from '../models/review';

const router = Router();

// Add a Review
router.post('/addReview', async (req: Request, res: Response) => {
  try {
    const { feedback, rating, podcastId, displayName, email, photoURL } = req.body;

    // Create and save the new review
    const reviewData = new Review({
      feedback,
      rating,
      podcastId,
      displayName,
      email,
      photoURL,
    });

    const result = await reviewData.save();
    res.status(200).send({ message: 'Review added successfully', data: result });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send({ error: 'Failed to add review' });
  }
});

// Get All Reviews
router.get('/allReviews', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().exec();
    res.status(200).send({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send({ error: 'Failed to fetch reviews' });
  }
});

export default router;
