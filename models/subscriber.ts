import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for a Subscriber document
interface ISubscriber extends Document {
    podcasterId: string;
    podcasterUid: string;
    subscriberEmail: string;
}

// Define the Mongoose schema for Subscriber
const SubscriberSchema: Schema = new Schema({
    podcasterId: { type: String, required: true },
    podcasterUid: { type: String, required: true },
    subscriberEmail: { type: String, required: true, unique: false },
}, { collection: 'subscriber' });

// Create and export the Mongoose model
const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
export default Subscriber;
export { ISubscriber };
