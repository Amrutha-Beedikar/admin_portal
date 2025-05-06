import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Career from '@/models/Career';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const career = await Career.findById(id);
        if (!career) {
          return res.status(404).json({ success: false, error: 'Career not found' });
        }
        res.status(200).json({ success: true, data: career });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error fetching career' });
      }
      break;

    case 'PUT':
      try {
        const career = await Career.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!career) {
          return res.status(404).json({ success: false, error: 'Career not found' });
        }
        res.status(200).json({ success: true, data: career });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error updating career' });
      }
      break;

    case 'DELETE':
      try {
        const career = await Career.findByIdAndDelete(id);
        if (!career) {
          return res.status(404).json({ success: false, error: 'Career not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error deleting career' });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Invalid request method' });
      break;
  }
}
