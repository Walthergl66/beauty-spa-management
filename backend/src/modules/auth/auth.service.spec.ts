import { createHash } from 'crypto';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { Role } from '../../common/enums/role.enum.js';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;
  let mockConfigService: any;
  let mockSessionService: any;

  beforeEach(() => {
    mockUsersService = {
      findByEmail: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      updateLoginSecurity: vi.fn(),
      incrementTokenVersion: vi.fn(),
    };

    mockJwtService = {
      signAsync: vi.fn().mockResolvedValue('mock_token'),
      verifyAsync: vi.fn().mockResolvedValue({
        sub: 'uuid-1',
        email: 'cliente@test.com',
        role: Role.CLIENT,
        ver: 0,
        sid: 'session-1',
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

    mockSessionService = {
      create: vi.fn().mockResolvedValue({ id: 'session-1' }),
      findValidById: vi.fn(),
      findById: vi.fn(),
      rotate: vi.fn().mockResolvedValue(undefined),
      deleteByIdAndUser: vi.fn().mockResolvedValue(true),
      deleteAllForUser: vi.fn().mockResolvedValue(undefined),
      listActiveForUser: vi.fn().mockResolvedValue([]),
    };

    authService = new AuthService(
      mockUsersService,
      mockJwtService,
      mockConfigService,
      mockSessionService,
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
    expect(mockSessionService.create).toHaveBeenCalled();
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

  it('should refresh tokens for a valid session', async () => {
    const refreshToken = 'valid.refresh.token';
    const storedHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      tokenVersion: 0,
    });
    mockSessionService.findValidById.mockResolvedValue({
      id: 'session-1',
      userId: 'uuid-1',
      refreshHash: storedHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const result = await authService.refreshToken(refreshToken);

    expect(result.accessToken).toBe('mock_token');
    expect(mockSessionService.rotate).toHaveBeenCalledWith(
      'session-1',
      createHash('sha256').update('mock_token').digest('hex'),
      expect.any(Date),
    );
  });

  it('should reject refresh when the stored token hash does not match', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      tokenVersion: 0,
    });
    mockSessionService.findValidById.mockResolvedValue({
      id: 'session-1',
      userId: 'uuid-1',
      refreshHash: createHash('sha256').update('otro.token.rotado').digest('hex'),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    await expect(
      authService.refreshToken('token.viejo'),
    ).rejects.toThrow('Token de actualización inválido o expirado');
  });

  it('should reject refresh when the session is gone', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      email: 'cliente@test.com',
      role: Role.CLIENT,
      isActive: true,
      tokenVersion: 0,
    });
    mockSessionService.findValidById.mockResolvedValue(null);

    await expect(
      authService.refreshToken('token.sin.sesion'),
    ).rejects.toThrow('Acceso denegado');
  });

  it('should reject refresh when the token is invalid or expired', async () => {
    mockJwtService.verifyAsync = vi
      .fn()
      .mockRejectedValue(new Error('jwt expired'));

    await expect(
      authService.refreshToken('expired.token'),
    ).rejects.toThrow('Token de actualización inválido o expirado');
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

  it('should close a specific session on logout', async () => {
    const result = await authService.logout('uuid-1', 'session-1');

    expect(result.message).toBe('Sesión cerrada exitosamente');
    expect(mockSessionService.deleteByIdAndUser).toHaveBeenCalledWith(
      'session-1',
      'uuid-1',
    );
    expect(mockUsersService.incrementTokenVersion).not.toHaveBeenCalled();
  });

  it('should close all sessions on logout all', async () => {
    const result = await authService.logout('uuid-1', undefined, true);

    expect(result.message).toBe('Todas las sesiones cerradas exitosamente');
    expect(mockUsersService.incrementTokenVersion).toHaveBeenCalledWith('uuid-1');
    expect(mockSessionService.deleteAllForUser).toHaveBeenCalledWith('uuid-1');
  });

  it('should change the password and invalidate current sessions', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      passwordHash: await authService.hashData('CurrentPass123!'),
      isActive: true,
    });
    mockUsersService.updatePassword = vi.fn().mockResolvedValue(undefined);
    mockUsersService.incrementTokenVersion = vi.fn().mockResolvedValue(undefined);
    mockSessionService.deleteAllForUser = vi.fn().mockResolvedValue(undefined);

    const result = await authService.changePassword('uuid-1', {
      currentPassword: 'CurrentPass123!',
      newPassword: 'NewPass456!',
    });

    expect(result.message).toContain('Contraseña actualizada');
    expect(mockUsersService.updatePassword).toHaveBeenCalledWith(
      'uuid-1',
      expect.any(String),
    );
    expect(mockUsersService.incrementTokenVersion).toHaveBeenCalledWith('uuid-1');
    expect(mockSessionService.deleteAllForUser).toHaveBeenCalledWith('uuid-1');
  });

  it('should reject change password when the current password is wrong', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'uuid-1',
      passwordHash: await authService.hashData('CurrentPass123!'),
      isActive: true,
    });

    await expect(
      authService.changePassword('uuid-1', {
        currentPassword: 'WrongPass123!',
        newPassword: 'NewPass456!',
      }),
    ).rejects.toThrow('La contraseña actual es incorrecta');
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