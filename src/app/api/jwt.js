import jwt from 'jsonwebtoken';

const jwtSecret = 'your_jwt_secret';

export const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};
