import mongoose, { Document, Schema } from 'mongoose';

interface IPodcast extends Document {
  title: string;
  musician: string;
  description: string;
  coverImageUrl: string;
  audioFileUrl: string;
  releaseDate: Date;
  category: string;
  userEmail: string;
  tags: string[];
  upVote: number;
  voters: string[];
}

const PodcastSchema: Schema = new Schema({
  title: { type: String, required: true },
  musician: { type: String, required: true },
  description: { type: String, required: true },
  coverImageUrl: { type: String, required: true },
  audioFileUrl: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  category: { type: String, required: true },
  userEmail: { type: String, required: true },
  tags: { type: [String], required: true },
  upVote: { type: Number, default: 0 },
  voters: { type: [String], default: [] },
},{ collection: 'podcast' });

const Podcast = mongoose.model<IPodcast>('Podcast', PodcastSchema);
export default Podcast;
