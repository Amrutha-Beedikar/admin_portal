import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Career from '@/models/Career';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const careers = await Career.find({}).sort({ _id: -1 });
        res.status(200).json({ success: true, data: careers });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error fetching careers' });
      }
      break;

    case 'POST':
      try {
        const career = await Career.create(req.body);
        res.status(201).json({ success: true, data: career });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error creating career' });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Invalid request method' });
      break;
  }
}
