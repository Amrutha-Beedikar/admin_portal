import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  slug: string;
  alternate_text?: string;
  internal_links?: string[];
  external_links?: string[];
  meta_title?: string;
  meta_description?: string;
  title: string;
  content: string;
  focus_keyword?: string;
  author_name?: string;
  default_date?: Date;
  category?: string;
  tags?: string[];
  thumbnail_url?: string;
  thumbnail_alt_text?: string;
  content_length?: number;
}

const BlogSchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true },
  alternate_text: { type: String },
  internal_links: [{ type: String }],
  external_links: [{ type: String }],
  meta_title: { type: String },
  meta_description: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
  focus_keyword: { type: String },
  author_name: { type: String },
  default_date: { type: Date, default: Date.now },
  category: { type: String },
  tags: [{ type: String }],
  thumbnail_url: { type: String },
  thumbnail_alt_text: { type: String },
}, {
  timestamps: true
});

// Virtual for content_length
BlogSchema.virtual('content_length').get(function (this: IBlog) {
  return this.content ? this.content.length : 0;
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);