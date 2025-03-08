import 'dotenv/config';
import * as SendGrid from '@sendgrid/mail';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendGrindService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async send(mail: SendGrid.MailDataRequired) {
    if (this.configService.get<string>('NODE_ENV') !== 'test') {
      try {
        mail.from = this.configService.get<string>('SEND_GRID_FROM');
        const transport = await SendGrid.send(mail);
        return transport;
      } catch (error) {
        Logger.error(error);
      }
    }
  }
}
