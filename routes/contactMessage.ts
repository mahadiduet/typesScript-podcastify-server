import { Router, Request, Response } from 'express';
import ContactMessage from '../models/contactMessage';

const router = Router();

// Save a contact message
router.post('/contact-message', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const contactMessage = new ContactMessage(data);
    const result = await contactMessage.save();
    res.status(201).send({ message: 'Message sent successfully', data: result });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).send({ error: 'Failed to send message' });
  }
});

// Retrieve all contact messages
router.get('/contact-message', async (req: Request, res: Response) => {
  try {
    const messages = await ContactMessage.find().exec();
    res.status(200).send({ messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).send({ error: 'Failed to retrieve messages' });
  }
});

export default router;
