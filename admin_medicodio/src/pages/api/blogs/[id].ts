import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Blog from '@/models/Blogs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const blog = await Blog.findById(id);
        if (!blog) {
          return res.status(404).json({ success: false, error: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: blog });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error fetching blog' });
      }
      break;

    case 'PUT':
      try {
        const blog = await Blog.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!blog) {
          return res.status(404).json({ success: false, error: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: blog });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error updating blog' });
      }
      break;

    case 'DELETE':
      try {
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
          return res.status(404).json({ success: false, error: 'Blog not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error deleting blog' });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Invalid request method' });
      break;
  }
}
