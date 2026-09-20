import { describe, it, expect, vi } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter.js';

function mockHost() {
  const json = vi.fn();
  const response = { status: vi.fn().mockReturnValue({ json }), json };
  const request = { method: 'GET', url: '/api/v1/test' };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  };
  return { host, json, response };
}

describe('AllExceptionsFilter', () => {
  it('should hide internal error details in production', () => {
    const filter = new AllExceptionsFilter(true);
    const { host, json, response } = mockHost();

    filter.catch(
      new Error('invalid input syntax for type uuid: "1000"'),
      host as any,
    );

    expect(response.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal server error',
      }),
    );
  });

  it('should reveal internal details in development', () => {
    const filter = new AllExceptionsFilter(false);
    const { host, json, response } = mockHost();

    filter.catch(new Error('some internal detail'), host as any);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'some internal detail',
      }),
    );
  });

  it('should preserve HttpException status and message', () => {
    const filter = new AllExceptionsFilter(true);
    const { host, json, response } = mockHost();

    filter.catch(new ForbiddenException('Acceso denegado'), host as any);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: 'Acceso denegado',
      }),
    );
  });
});