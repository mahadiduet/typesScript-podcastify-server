import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for a user document
interface IUser extends Document {
    name: string;
    email: string;
    role: string;
    uid: string;
    flag?: boolean | string;
    isPodcasterRequested?: boolean;
    userPhotoUrl?: string;
    username?: string;
    phoneNumber?: string;
}

// Define the Mongoose schema for User
const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    uid: { type: String, required: true },
    flag: { type: Schema.Types.Mixed, default: false },
    isPodcasterRequested: { type: Boolean, default: false },
    userPhotoUrl: { type: String },
    username: { type: String },
    phoneNumber: { type: String }
}, { collection: 'users' });

// Create and export the Mongoose model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
export { IUser };
