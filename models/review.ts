import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for a Review document
interface IReview extends Document {
    feedback: string;
    rating: number;
    podcastId: string;
    displayName: string;
    email: string;
    photoURL: string;
}

// Define the Mongoose schema for Review
const ReviewSchema: Schema = new Schema({
    feedback: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    podcastId: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    photoURL: { type: String, required: true },
}, { collection: 'reviews' });

// Create and export the Mongoose model
const Review = mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
export { IReview };
