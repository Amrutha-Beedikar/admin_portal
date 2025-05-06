import mongoose, { Schema, Document } from 'mongoose';

export interface ICareer extends Document {
  job_title: string;
  experience?: string; // e.g., '2 years', '6 months'
  description?: string;
}

const CareerSchema: Schema = new Schema({
  job_title: { type: String, required: true },
  experience: { type: String }, // Store as string for flexibility
  description: { type: String },
});

export default mongoose.models.Career || mongoose.model<ICareer>('Career', CareerSchema);
