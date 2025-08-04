import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, body, query } = req;
    const start = Date.now();

    res.on('finish', () => {
      const ms = Date.now() - start;
      this.logger.log(
        `
    REQUEST: ${method} ${originalUrl}
    Headers: ${JSON.stringify(headers)}
    Query: ${JSON.stringify(query)}
    Body: ${JSON.stringify(body)}
    RESPONSE: Status ${res.statusCode} - ${ms}ms`
      );
    });

    next();
  }
}