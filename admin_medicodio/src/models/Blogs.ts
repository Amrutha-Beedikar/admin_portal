import mongoose, { Schema, Document, Model } from 'mongoose';

interface IRevision {
  content: string;
  title: string;
  modified_at: Date;
  modified_by?: string;
}

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
  author_email?: string;
  default_date?: Date;
  category?: string;
  tags?: string[];
  content_length?: number;
  status: 'draft' | 'published' | 'archived' | 'trash';
  featured: boolean;
  view_count: number;
  reading_time?: number;
  revisions: IRevision[];
  last_modified: Date;
  published_at?: Date;
  scheduled_for?: Date;
  seo_score?: number;
  is_commentable: boolean;
  comments_count: number;
  likes_count: number;
  shares_count: number;
}

const RevisionSchema = new Schema<IRevision>({
  content: { type: String, required: true },
  title: { type: String, required: true },
  modified_at: { type: Date, default: Date.now },
  modified_by: { type: String },
});

const BlogSchema = new Schema<IBlog>({
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
  author_email: { type: String },
  default_date: { type: Date, default: Date.now },
  category: { type: String },
  tags: [{ type: String }],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived', 'trash'],
    default: 'draft'
  },
  featured: { type: Boolean, default: false },
  view_count: { type: Number, default: 0 },
  revisions: { type: [RevisionSchema], default: [] },
  last_modified: { type: Date, default: Date.now },
  published_at: { type: Date },
  scheduled_for: { type: Date },
  seo_score: { type: Number, min: 0, max: 100 },
  is_commentable: { type: Boolean, default: true },
  comments_count: { type: Number, default: 0 },
  likes_count: { type: Number, default: 0 },
  shares_count: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Virtual for content_length
BlogSchema.virtual('content_length').get(function(this: IBlog) {
  return this.content ? this.content.length : 0;
});

// Virtual for reading_time
BlogSchema.virtual('reading_time').get(function(this: IBlog) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Middleware to update last_modified
BlogSchema.pre('save', function(this: IBlog, next) {
  this.last_modified = new Date();
  next();
});

// Middleware to create revision
BlogSchema.pre('save', function(this: IBlog, next) {
  if (this.isModified('content') || this.isModified('title')) {
    this.revisions.push({
      content: this.content,
      title: this.title,
      modified_at: new Date(),
      modified_by: this.author_name || 'Unknown'
    });
  }
  next();
});

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
export default Blog;