import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : 'An unexpected error occurred.';

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  /**
   * `HttpException.message` e sempre uma string generica derivada do nome
   * da classe (ex.: "Bad Request Exception") quando a `response` passada ao
   * construtor nao e uma string — e o caso do `ValidationPipe`, que lanca
   * `BadRequestException(errors)` com `errors` sendo um array de mensagens.
   * Usar `getResponse()` (o corpo real da excecao) preserva a mensagem de
   * validacao de verdade em vez do nome generico da classe. Bug real:
   * antes, todo erro 400 de validacao chegava ao cliente so como "Bad
   * Request Exception", sem indicar qual campo falhou.
   */
  private extractMessage(exception: HttpException): string | string[] {
    const body = exception.getResponse();

    if (typeof body === 'string') {
      return body;
    }

    if (
      body &&
      typeof body === 'object' &&
      'message' in body &&
      (typeof (body as { message: unknown }).message === 'string' ||
        Array.isArray((body as { message: unknown }).message))
    ) {
      return (body as { message: string | string[] }).message;
    }

    return exception.message;
  }
}
