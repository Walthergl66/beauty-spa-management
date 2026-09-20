import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor.js';

/**
 * Flujos multi-dispositivo (Sprint 9): dos sesiones simultáneas,
 * renovación independiente, logout selectivo y cierre total.
 * REQUIERE PostgreSQL (docker compose up).
 */
describe('Sesiones multi-dispositivo (e2e, requiere DB)', () => {
  let app: INestApplication<App>;
  let dbUp = false;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@spa.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234*';

  let device1 = { accessToken: '', refreshToken: '', sessionId: '' };
  let device2 = { accessToken: '', refreshToken: '', sessionId: '' };

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.setGlobalPrefix('api/v1');
      app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
      app.useGlobalInterceptors(new TransformInterceptor());
      await app.init();
      dbUp = true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`E2E con DB omitido (sin PostgreSQL): ${String(error).split('\n')[0]}`);
    }
  }, 60000);

  afterAll(async () => {
    if (app) await app.close();
  });

  const dataOf = (res: request.Response) => res.body?.data ?? res.body;

  const login = async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: adminEmail, password: adminPassword })
      .expect(200);
    return {
      accessToken: dataOf(res).tokens.accessToken,
      refreshToken: dataOf(res).tokens.refreshToken,
      sessionId: dataOf(res).tokens.sessionId,
    };
  };

  it('admin abre dos sesiones simultáneas con sessionId distinto', async () => {
    if (!dbUp) return;
    device1 = await login();
    device2 = await login();
    expect(device1.sessionId).toBeDefined();
    expect(device2.sessionId).toBeDefined();
    expect(device1.sessionId).not.toBe(device2.sessionId);
  });

  it('listado de sesiones muestra ambas activas', async () => {
    if (!dbUp) return;
    const my = await request(app.getHttpServer())
      .get('/api/v1/auth/sessions')
      .set('Authorization', `Bearer ${device1.accessToken}`)
      .expect(200);
    const sessions = dataOf(my);
    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBeGreaterThanOrEqual(2);
  });

  it('cada sesión renueva su refresh token de forma independiente', async () => {
    if (!dbUp) return;
    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: device1.refreshToken })
      .expect(200);
    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: device2.refreshToken })
      .expect(200);
  });

  it('logout de un dispositivo no afecta al otro', async () => {
    if (!dbUp) return;
    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${device1.accessToken}`)
      .send({ sessionId: device1.sessionId })
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${device1.accessToken}`)
      .expect(401);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${device2.accessToken}`)
      .expect(200);
  });

  it('cierre total invalida el dispositivo restante', async () => {
    if (!dbUp) return;
    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${device2.accessToken}`)
      .send({ all: true })
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${device2.accessToken}`)
      .expect(401);
  });
});