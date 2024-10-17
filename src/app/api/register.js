import db from '../../utils/db';
import { hashPassword } from '../../utils/bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, firstName, lastName } = req.body;

  try {
    const hash = await hashPassword(password);
    const query = 'INSERT INTO Users (email, password_hash) VALUES (?, ?)';
    db.query(query, [email, hash], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error registering user', error: err });
      }

      const userId = result.insertId;
      const profileQuery = 'INSERT INTO UserProfile (user_id, first_name, last_name) VALUES (?, ?, ?)';
      db.query(profileQuery, [userId, firstName, lastName], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating user profile', error: err });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error hashing password' });
  }
}