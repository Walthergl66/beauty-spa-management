import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JwtStrategy } from './jwt.strategy.js';
import { Role } from '../../../common/enums/role.enum.js';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockUsersService: any;

  beforeEach(() => {
    mockUsersService = {
      findById: vi.fn(),
    };
    const mockConfigService = {
      getOrThrow: vi.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test_jwt_secret';
        return undefined;
      }),
    };
    strategy = new JwtStrategy(mockConfigService, mockUsersService);
  });

  it('should allow access when the token version matches the user version', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      firstName: 'Laura',
      lastName: 'Mendoza',
      tokenVersion: 2,
    });

    const result = await strategy.validate({
      sub: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      ver: 2,
    });

    expect(result.id).toBe('uuid-1');
  });

  it('should reject access tokens issued before logout', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      tokenVersion: 3,
    });

    await expect(
      strategy.validate({
        sub: 'uuid-1',
        email: 'cliente@test.com',
        role: Role.CLIENT,
        ver: 2,
      }),
    ).rejects.toThrow('Sesión inválida, vuelve a iniciar sesión');
  });
});