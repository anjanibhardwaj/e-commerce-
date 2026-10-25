import crypto from 'crypto';
import { config } from '../config/env.js';

export class StorageService {
  /**
   * Generates a time-limited cryptographically signed preview URL for private prescriptions
   */
  static getSignedPreviewUrl(fileKey, expiresInSeconds = 900) {
    if (config.storageDriver === 's3') {
      return `https://medical-ecommerce-vault.s3.ap-south-1.amazonaws.com/${fileKey}?expires=${expiresInSeconds}`;
    }

    const timestamp = Date.now() + expiresInSeconds * 1000;
    const hmac = crypto
      .createHmac('sha256', config.jwtSecret)
      .update(`${fileKey}:${timestamp}`)
      .digest('hex');

    return `${config.backendUrl}/api/v1/prescriptions/preview/${fileKey}?expires=${timestamp}&sig=${hmac}`;
  }

  /**
   * Verifies preview signature before streaming file
   */
  static verifyPreviewSignature(fileKey, timestamp, signature) {
    if (Date.now() > Number(timestamp)) {
      return false; // Token expired
    }
    const expected = crypto
      .createHmac('sha256', config.jwtSecret)
      .update(`${fileKey}:${timestamp}`)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }
}
