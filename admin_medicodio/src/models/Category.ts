import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  created_at: Date;
  updated_at: Date;
}

const CategorySchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters long'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema); 