import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Playlist } from '../models/Playlist';

const router = Router();

// Add to Playlist
router.post('/playlist', async (req: Request, res: Response) => {
  try {
    const { music_id, title, user_email } = req.body;

    const query = { user_email, music_id };

    const existingPlaylist = await Playlist.findOne(query);

    if (existingPlaylist) {
      return res.send({
        message: 'Podcast already exists in playlist.',
        insertedId: null,
      });
    }

    const playlistData = new Playlist({
      user_email,
      music_id,
      title,
    });

    const result = await playlistData.save();
    res.status(200).send({ message: 'Playlist added successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to add playlist' });
  }
});

// Manage Playlist
router.get('/manage-playlist', async (req: Request, res: Response) => {
  const { userEmail, page = '0', limit = '5' } = req.query;

  if (!userEmail) {
    return res.status(400).send({ message: 'Email is required' });
  }

  const skip = parseInt(page as string) * parseInt(limit as string);

  try {
    const playlist = await Playlist.find({ user_email: userEmail as string })
      .skip(skip)
      .limit(parseInt(limit as string))
      .exec();

    const total = await Playlist.countDocuments({ user_email: userEmail as string });

    res.status(200).send({ playlist, total });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).send({ message: 'Failed to fetch playlist' });
  }
});

// Delete Playlist Item
router.delete('/playlist/:id', async (req: Request, res: Response) => {
  try {
    const item_id = new mongoose.Types.ObjectId(req.params.id);
    const result = await Playlist.deleteOne({ _id: item_id });

    if (!result.deletedCount) {
      return res.status(404).send({ message: 'Playlist item not found' });
    }

    res.send({ message: 'Playlist podcast deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist item:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

export default router;
