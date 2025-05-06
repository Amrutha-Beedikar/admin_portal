import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const events = await Event.find({}).sort({ event_time: -1 });
        res.status(200).json({ success: true, data: events });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error fetching events' });
      }
      break;

    case 'POST':
      try {
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error creating event' });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Invalid request method' });
      break;
  }
} 