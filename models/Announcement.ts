import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for the Announcement document
interface IAnnouncement extends Document {
    title: string;
    email: string;
    description: string;
}

// Define the Mongoose schema for Announcement
const AnnouncementSchema: Schema = new Schema({
    title: { type: String, required: true },
    email: { type: String, required: false },
    description: { type: String, required: true },
}, { collection: 'announcement' });

// Create and export the Mongoose model
const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
export default Announcement;
export { IAnnouncement };
