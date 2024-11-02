import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for a contact message document
interface IContactMessage extends Document {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}

// Define the Mongoose schema for ContactMessage
const ContactMessageSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
}, { collection: 'contact-message' });

// Create and export the Mongoose model
const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
export default ContactMessage;
export { IContactMessage };
