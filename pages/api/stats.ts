import { NextApiRequest, NextApiResponse } from 'next';
import { getDashboardStats } from '../../src/lib/dashboard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const stats = await getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats', details: String(error) });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

