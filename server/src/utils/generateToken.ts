import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'autoforge_super_secret_jwt_key_2026';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '30d',
  });
};

