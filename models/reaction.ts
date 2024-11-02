import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for a Reaction document
interface IReaction extends Document {
    react: string;
    postId: string;
    name: string | null;
    email: string;
}

// Define the Mongoose schema for Reaction
const ReactionSchema: Schema = new Schema({
    react: { type: String, required: true },
    postId: { type: String, required: true },
    name: { type: String, required: false, default: null },
    email: { type: String, required: true },
}, { collection: 'reactions' });

// Create and export the Mongoose model
const Reaction = mongoose.model<IReaction>('Reaction', ReactionSchema);
export default Reaction;
export { IReaction };
