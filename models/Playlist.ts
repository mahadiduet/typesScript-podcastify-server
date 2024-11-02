// models/Playlist.ts
import mongoose, { Schema, Document } from "mongoose";

interface IPlaylist extends Document {
  user_email: string;
  music_id: string;
  title: string;
}

const PlaylistSchema: Schema = new Schema({
  user_email: { type: String, required: true },
  music_id: { type: String, required: true },
  title: { type: String, required: true },
},{ collection: 'playlist' });

export const Playlist = mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
