import db from '../../utils/db';
import { verifyToken } from '../../utils/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function getUserProfile(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyToken(token);
    const userId = decoded.id;

    const query = `
      SELECT Users.email, UserProfile.first_name, UserProfile.last_name, UserProfile.phone_number,
             UserProfile.date_of_birth, UserProfile.start_date, UserProfile.rate, UserProfile.total_income
      FROM Users
      INNER JOIN UserProfile ON Users.id = UserProfile.user_id
      WHERE Users.id = ?
    `;
    db.query(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving user profile', error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(results[0]);
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}