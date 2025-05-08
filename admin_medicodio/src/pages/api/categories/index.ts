import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import Category from '../../../models/Category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        const categories = await Category.find({}).sort({ name: 1 });
        return res.status(200).json({ success: true, data: categories });

      case 'POST':
        const { name } = req.body;
        
        if (!name) {
          return res.status(400).json({ success: false, error: 'Category name is required' });
        }

        const category = new Category({ name });
        await category.save();

        return res.status(201).json({ 
          success: true, 
          data: category
        });

      case 'PUT':
        const { _id, name: updateName } = req.body;
        
        if (!_id || !updateName) {
          return res.status(400).json({ success: false, error: 'Category ID and name are required' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
          _id,
          { name: updateName },
          { new: true, runValidators: true }
        );

        if (!updatedCategory) {
          return res.status(404).json({ success: false, error: 'Category not found' });
        }

        return res.status(200).json({ 
          success: true, 
          data: updatedCategory
        });

      case 'DELETE':
        const { _id: deleteId } = req.body;
        
        if (!deleteId) {
          return res.status(400).json({ success: false, error: 'Category ID is required' });
        }

        const deletedCategory = await Category.findByIdAndDelete(deleteId);

        if (!deletedCategory) {
          return res.status(404).json({ success: false, error: 'Category not found' });
        }

        return res.status(200).json({ success: true });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in categories API:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
} 