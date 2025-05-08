import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Blog from '@/models/Blogs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const blogs = await Blog.find({}).sort({ default_date: -1 });
        res.status(200).json({ success: true, data: blogs });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error fetching blogs' });
      }
      break;

    case 'POST':
      try {
        const blog = await Blog.create(req.body);
        res.status(201).json({ success: true, data: blog });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error creating blog' });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Invalid request method' });
      break;
  }
}
