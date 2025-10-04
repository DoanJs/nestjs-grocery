import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    // const serviceAccount = path.resolve(
    //   __dirname,
    //   '../../firebase-service-account.json',
    // );
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    this.messaging = admin.messaging();
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    id: string,
    type: string,
  ) {
    const message = {
      token,
      data: {
        id: String(id),
        type: String(type),
        title: String(title),
        body: String(body),
      },
    };

    try {
      const messageId = await this.messaging.send(message);

      // Firebase trả về successCount và failureCount
      // Log token lỗi
      // response.responses.forEach((resp, idx) => {
      //   if (!resp.success) {
      //     console.warn('Token thất bại:', tokens[idx], resp.error);
      //   }
      // });

      // return {
      //   successCount: response.successCount,
      //   failureCount: response.failureCount,
      //   responses: response.responses,
      // };
      return {
        success: true,
        messageId,
      };
    } catch (error) {
      console.error('Lỗi gửi notification:', error);
      return { success: false, error };
    }
  }
  async sendNotificationToMany(
    tokens: string[],
    title: string,
    body: string,
    id: string,
    type: string,
  ) {
    const message = {
      tokens,
      data: {
        id: String(id),
        type: String(type),
        title: String(title),
        body: String(body),
      },
    };

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
