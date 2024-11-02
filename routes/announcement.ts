import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Announcement from '../models/Announcement';

const router = Router();

// Add an Announcement
router.post('/announcement', async (req: Request, res: Response) => {
  try {
    const { title, email, description } = req.body;

    const announcementData = new Announcement({
      title,
      email,
      description,
    });

    const result = await announcementData.save();
    res.status(200).send({ message: 'Announcement added successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to add announcement' });
  }
});

// Get All Announcements
router.get('/announcements', async (req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find().exec();
    res.status(200).send({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).send({ message: 'Failed to fetch announcements' });
  }
});

// Get Announcement by ID
router.get('/announcement/:id', async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findById(req.params.id).exec();
    if (!announcement) {
      return res.status(404).send({ message: 'Announcement not found' });
    }
    res.status(200).send({ announcement });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).send({ message: 'Failed to fetch announcement' });
  }
});

// Delete Announcement by ID
router.delete('/announcement/:id', async (req: Request, res: Response) => {
  try {
    const result = await Announcement.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Announcement not found' });
    }
    res.status(200).send({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).send({ message: 'Failed to delete announcement' });
  }
});

export default router;
