import { Injectable } from '@nestjs/common';

@Injectable()
export class CsrfService {
  getCsrfToken(req: any): string {
    return req.csrfToken();
  }
}
