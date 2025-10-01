import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    const serviceAccount = path.resolve(
      __dirname,
      '../../firebase-service-account.json',
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    this.messaging = admin.messaging();
  }

  async sendNotificationToMany(tokens: string[], title: string, body: string) {
    const message = {
      tokens,
      notification: { title, body },
    };

    console.log(tokens)
    try {
      const response = await this.messaging.sendEachForMulticast(message);

      // Firebase trả về successCount và failureCount
      // Log token lỗi
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        console.warn('Token thất bại:', tokens[idx], resp.error);
      }
    });

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    };
    } catch (error) {
      console.error('Lỗi gửi notification:', error);
      return { success: false, error };
    }
  }
}
