import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(plainText: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainText, saltRounds);
    return hashedPassword;
  }

  async compare(palinText: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(palinText, hash);
    return isMatch;
  }
}
