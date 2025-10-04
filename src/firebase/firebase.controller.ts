import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('notifications')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) { }

  @Post('send')
  async send(@Body() body: {
    token: string;
    title: string;
    body: string;
    id: string;
    type: string
  }) {
    return this.firebaseService.sendNotification(
      body.token,
      body.title,
      body.body,
      body.id,
      body.type
    );
  }
  @Post('sends')
  async sends(@Body() body: {
    tokens: string[];
    title: string;
    body: string;
    id: string;
    type: string
  }) {
    return this.firebaseService.sendNotificationToMany(
      body.tokens,
      body.title,
      body.body,
      body.id,
      body.type
    );
  }
}
