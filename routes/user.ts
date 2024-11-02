import { Router, Request, Response } from 'express';
import User from '../models/User';
import verifyToken from '../middleware/verifyToken';
import mongoose from 'mongoose';

const router = Router();

// Get total number of users
router.get('/admin-stats', verifyToken, async (req: Request, res: Response) => {
  try {
    const users = await User.estimatedDocumentCount();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user count' });
  }
});

// Retrieve all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

// Get users who requested to be a podcaster
router.get('/request-podcaster', async (req: Request, res: Response) => {
  try {
    const podcasterRequests = await User.find({ flag: true }).exec();
    res.json(podcasterRequests);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving requests' });
  }
});

// Update user role and flag
router.put('/users/request/:email', verifyToken, async (req: Request, res: Response) => {
  const { email } = req.params;
  const { flag, role } = req.body;

  try {
    const result = await User.updateOne({ email }, { $set: { flag, role } });
    if (result.modifiedCount > 0) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found or no changes made' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Add a user to the database on login
router.post('/users', async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.json({ message: 'User already exists', insertedId: null });
    }

    const newUser = new User(user);
    const result = await newUser.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error saving user' });
  }
});

// Delete a user
router.delete('/users/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const user = await User.findById(id);
    const result = await User.deleteOne({ _id: id });

    if (user && user.uid) {
      await admin.auth().deleteUser(user.uid); // Assuming Firebase Admin SDK is configured
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Get a single user by email
router.get('/users/email/:email', async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user' });
  }
});

// Update user data by email
router.put('/users/email/:email', async (req: Request, res: Response) => {
  const { email } = req.params;
  const { name, username, phoneNumber } = req.body;

  try {
    const result = await User.updateOne(
      { email },
      { $set: { name, username, phoneNumber } }
    );
    if (result.modifiedCount > 0) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found or no changes made' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

export default router;
