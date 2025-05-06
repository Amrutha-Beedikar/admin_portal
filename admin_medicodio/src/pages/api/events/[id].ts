import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const event = await Event.findById(id);
        if (!event) {
          return res.status(404).json({ success: false, error: 'Event not found' });
        }
        res.status(200).json({ success: true, data: event });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error fetching event' });
      }
      break;

    case 'PUT':
      try {
        const event = await Event.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!event) {
          return res.status(404).json({ success: false, error: 'Event not found' });
        }
        res.status(200).json({ success: true, data: event });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error updating event' });
      }
      break;

    case 'DELETE':
      try {
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
          return res.status(404).json({ success: false, error: 'Event not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error deleting event' });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Invalid request method' });
      break;
  }
} 