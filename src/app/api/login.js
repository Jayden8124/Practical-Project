import db from '../../utils/db';
import { comparePassword } from '../../utils/bcrypt';
import { generateToken } from '../../utils/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  const query = 'SELECT * FROM Users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving user', error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    try {
      const isMatch = await comparePassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken({ id: user.id, email: user.email });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error comparing passwords' });
    }
  });
}