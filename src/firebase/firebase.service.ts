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

  async sendNotification(token: string, title: string, body: string) {
    const message = {
      token,
      notification: { title, body },
    };

    try {
      const response = await this.messaging.send(message);
      return { success: true, response };
    } catch (error) {
      return { success: false, error };
    }
  }
}
