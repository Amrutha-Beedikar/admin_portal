import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  link: string;
  event_time: Date;
  video_url?: string;
  description?: string;
  created_at: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  event_time: { type: Date, required: true },
  video_url: { type: String },
  description: { type: String },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema); 