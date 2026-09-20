import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JwtStrategy } from './jwt.strategy.js';
import { Role } from '../../../common/enums/role.enum.js';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockUsersService: any;
  let mockSessionService: any;

  beforeEach(() => {
    mockUsersService = {
      findById: vi.fn(),
    };
    mockSessionService = {
      findValidById: vi.fn(),
    };
    const mockConfigService = {
      getOrThrow: vi.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test_jwt_secret';
        return undefined;
      }),
    };
    strategy = new JwtStrategy(
      mockConfigService,
      mockUsersService,
      mockSessionService,
    );
  });

  it('should allow access for a valid session and matching token version', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      firstName: 'Laura',
      lastName: 'Mendoza',
      tokenVersion: 2,
    });
    mockSessionService.findValidById.mockResolvedValue({
      id: 'session-1',
      userId: 'uuid-1',
      refreshHash: 'abc',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const result = await strategy.validate({
      sub: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      ver: 2,
      sid: 'session-1',
    });

    expect(result.id).toBe('uuid-1');
    expect(result.sid).toBe('session-1');
  });

  it('should reject access tokens issued before logout (version mismatch)', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      tokenVersion: 3,
    });
    mockSessionService.findValidById.mockResolvedValue({
      id: 'session-1',
      userId: 'uuid-1',
      refreshHash: 'abc',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    await expect(
      strategy.validate({
        sub: 'uuid-1',
        email: 'cliente@test.com',
        role: Role.CLIENT,
        ver: 2,
        sid: 'session-1',
      }),
    ).rejects.toThrow('Sesión inválida, vuelve a iniciar sesión');
  });

  it('should reject access tokens when the session was closed', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      tokenVersion: 2,
    });
    mockSessionService.findValidById.mockResolvedValue(null);

    await expect(
      strategy.validate({
        sub: 'uuid-1',
        email: 'cliente@test.com',
        role: Role.CLIENT,
        ver: 2,
        sid: 'session-1',
      }),
    ).rejects.toThrow('Sesión inválida, vuelve a iniciar sesión');
  });
});