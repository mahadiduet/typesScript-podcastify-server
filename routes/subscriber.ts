import { Router, Request, Response } from 'express';
import Subscriber from '../models/subscriber';

const router = Router();

// Add a Subscription
router.post('/subscriptions', async (req: Request, res: Response) => {
  try {
    const { podcasterId, podcasterUid, subscriberEmail } = req.body;

    // Check if already subscribed
    const existingSubscription = await Subscriber.findOne({
      podcasterId,
      subscriberEmail,
    });

    if (existingSubscription) {
      res.status(200).send({ message: 'Already subscribed' });
      return;
    }

    // Create and save the new subscription
    const newSubscriber = new Subscriber({
      podcasterId,
      podcasterUid,
      subscriberEmail,
    });

    const result = await newSubscriber.save();
    res.status(200).send({ message: 'Subscription added successfully', data: result });
  } catch (error) {
    console.error('Error adding subscription:', error);
    res.status(500).send({ error: 'Failed to add subscription' });
  }
});

// Get Total Subscribers
router.get('/totalSubscriber', async (req: Request, res: Response) => {
  try {
    const subscribers = await Subscriber.find().exec();
    res.status(200).send({ subscribers });
  } catch (error) {
    console.error('Error fetching total subscribers:', error);
    res.status(500).send({ error: 'Failed to fetch total subscribers' });
  }
});

// Get My Subscriptions by Email
router.get('/mySubscription/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const subscriptions = await Subscriber.find({ subscriberEmail: email }).exec();
    res.status(200).send({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).send({ error: 'Failed to fetch subscriptions' });
  }
});

export default router;
