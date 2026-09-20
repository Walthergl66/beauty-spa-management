import { createHash } from 'crypto';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { Role } from '../../common/enums/role.enum.js';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;
  let mockConfigService: any;

  beforeEach(() => {
    mockUsersService = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      updateRefreshToken: vi.fn(),
      updateLoginSecurity: vi.fn(),
      incrementTokenVersion: vi.fn(),
    };

    mockJwtService = {
      signAsync: vi.fn().mockResolvedValue('mock_token'),
      verifyAsync: vi.fn().mockResolvedValue({
        sub: 'uuid-1',
        email: 'cliente@test.com',
        role: Role.CLIENT,
      }),
    };

    mockConfigService = {
      get: vi.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test_jwt_secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test_jwt_refresh_secret';
        if (key === 'ADMIN_EMAIL') return 'admin@spa.com';
        return undefined;
      }),
      getOrThrow: vi.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test_jwt_secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test_jwt_refresh_secret';
        if (key === 'ADMIN_EMAIL') return 'admin@spa.com';
        return undefined;
      }),
    };

    authService = new AuthService(
      mockUsersService,
      mockJwtService,
      mockConfigService,
    );
  });

  it('should hash and compare passwords correctly using bcrypt', async () => {
    const password = 'SecurePassword123!';
    const hash = await authService.hashData(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);

    const matches = await authService.compareData(password, hash);
    expect(matches).toBe(true);

    const wrongMatches = await authService.compareData('WrongPass', hash);
    expect(wrongMatches).toBe(false);
  });

  it('should register a new client user', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      firstName: 'Laura',
      lastName: 'Mendoza',
      role: Role.CLIENT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await authService.register({
      email: 'cliente@test.com',
      password: 'Password123!',
      firstName: 'Laura',
      lastName: 'Mendoza',
    });

    expect(result.user.email).toBe('cliente@test.com');
    expect(result.tokens.accessToken).toBe('mock_token');
    expect(result.tokens.refreshToken).toBe('mock_token');
    expect(result.tokens.expiresIn).toBe(86400);
  });

  it('should reflect a custom access token TTL configured as 2h', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      firstName: 'Laura',
      lastName: 'Mendoza',
      role: Role.CLIENT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockConfigService.get = vi.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test_jwt_secret';
      if (key === 'JWT_REFRESH_SECRET') return 'test_jwt_refresh_secret';
      if (key === 'JWT_EXPIRES_IN') return '2h';
      if (key === 'JWT_REFRESH_EXPIRES_IN') return '14d';
      if (key === 'ADMIN_EMAIL') return 'admin@spa.com';
      return undefined;
    });
    mockConfigService.getOrThrow = mockConfigService.get;

    const result = await authService.register({
      email: 'cliente@test.com',
      password: 'Password123!',
      firstName: 'Laura',
      lastName: 'Mendoza',
    });

    expect(result.tokens.expiresIn).toBe(7200);
  });

  it('should refresh tokens with a valid refresh token', async () => {
    const refreshToken = 'valid.refresh.token';
    const storedHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      refreshTokenHash: storedHash,
    });

    const result = await authService.refreshToken(refreshToken);

    expect(result.accessToken).toBe('mock_token');
    expect(result.refreshToken).toBe('mock_token');
    const expectedStored = createHash('sha256')
      .update('mock_token')
      .digest('hex');
    expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
      'uuid-1',
      expectedStored,
    );
  });

  it('should reject refresh when the stored token hash does not match', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      refreshTokenHash: createHash('sha256')
        .update('otro.token.rotado')
        .digest('hex'),
    });

    await expect(
      authService.refreshToken('token.viejo'),
    ).rejects.toThrow('Token de actualización inválido o expirado');
  });

  it('should reject refresh when the token is invalid or expired', async () => {
    mockJwtService.verifyAsync = vi
      .fn()
      .mockRejectedValue(new Error('jwt expired'));

    await expect(
      authService.refreshToken('expired.token'),
    ).rejects.toThrow('Token de actualización inválido o expirado');
  });

  it('should reject login for a non-existent email with the same response', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'no-existe@test.com',
        password: 'CualquierPassword',
      }),
    ).rejects.toThrow('Credenciales incorrectas');
  });

  it('should reject login if password is incorrect', async () => {
    const passwordHash = await authService.hashData('CorrectPassword');
    mockUsersService.findByEmail.mockResolvedValue({
      id: 'uuid-1',
      email: 'test@test.com',
      passwordHash,
      isActive: true,
    });

    await expect(
      authService.login({
        email: 'test@test.com',
        password: 'WrongPassword',
      }),
    ).rejects.toThrow('Credenciales incorrectas');
    expect(mockUsersService.updateLoginSecurity).toHaveBeenCalledWith(
      'uuid-1',
      1,
      null,
    );
  });

  it('should lock the account after 5 consecutive failed attempts', async () => {
    const passwordHash = await authService.hashData('CorrectPassword');
    mockUsersService.findByEmail.mockResolvedValue({
      id: 'uuid-1',
      email: 'test@test.com',
      passwordHash,
      isActive: true,
      failedLoginAttempts: 4,
    });

    await expect(
      authService.login({
        email: 'test@test.com',
        password: 'WrongPassword',
      }),
    ).rejects.toThrow('Cuenta bloqueada temporalmente');

    expect(mockUsersService.updateLoginSecurity).toHaveBeenCalledWith(
      'uuid-1',
      0,
      expect.any(Date),
    );
  });

  it('should reject login with correct password while the account is locked', async () => {
    const passwordHash = await authService.hashData('CorrectPassword');
    const lockedUntil = new Date(Date.now() + 10 * 60 * 1000);
    mockUsersService.findByEmail.mockResolvedValue({
      id: 'uuid-1',
      email: 'test@test.com',
      passwordHash,
      isActive: true,
      lockedUntil,
    });

    await expect(
      authService.login({
        email: 'test@test.com',
        password: 'CorrectPassword',
      }),
    ).rejects.toThrow('Cuenta bloqueada temporalmente');
    expect(mockUsersService.updateLoginSecurity).not.toHaveBeenCalled();
  });

  it('should reset failed attempts on a successful login', async () => {
    mockUsersService.findByEmail.mockResolvedValue({
      id: 'uuid-1',
      email: 'test@test.com',
      passwordHash: await authService.hashData('CorrectPassword'),
      isActive: true,
      failedLoginAttempts: 3,
    });

    const result = await authService.login({
      email: 'test@test.com',
      password: 'CorrectPassword',
    });

    expect(result.tokens.accessToken).toBe('mock_token');
    expect(mockUsersService.updateLoginSecurity).toHaveBeenCalledWith(
      'uuid-1',
      0,
      null,
    );
  });

  it('should increment token version on logout to invalidate access tokens', async () => {
    const result = await authService.logout('uuid-1');

    expect(result.message).toBe('Sesión cerrada exitosamente');
    expect(mockUsersService.incrementTokenVersion).toHaveBeenCalledWith('uuid-1');
    expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
      'uuid-1',
      null,
    );
  });

  it('should skip admin seeding in production unless forced', async () => {
    mockConfigService.get = vi.fn((key: string) => {
      if (key === 'NODE_ENV') return 'production';
      return undefined;
    });

    await authService.onApplicationBootstrap();
    expect(mockUsersService.findByEmail).not.toHaveBeenCalled();

    mockConfigService.get = vi.fn((key: string) => {
      if (key === 'NODE_ENV') return 'production';
      if (key === 'SEED_ADMIN') return 'true';
      return undefined;
    });
    mockConfigService.getOrThrow = vi.fn((key: string) => {
      if (key === 'ADMIN_EMAIL') return 'admin@spa.com';
      if (key === 'ADMIN_PASSWORD') return 'Admin1234*';
      return undefined;
    });
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({
      id: 'uuid-9',
      email: 'admin@spa.com',
      role: Role.ADMIN,
    });

    await authService.onApplicationBootstrap();
    expect(mockUsersService.findByEmail).toHaveBeenCalled();
  });
});
