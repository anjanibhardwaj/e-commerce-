import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';

export class AuthService {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  static generateTokens(payload) {
    const accessToken = jwt.sign(
      {
        sub: payload.id,
        role: payload.role,
        email: payload.email,
        name: payload.name
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { sub: payload.id, role: payload.role },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }

  static async verifyRefreshToken(token) {
    return jwt.verify(token, config.jwtRefreshSecret);
  }
}
