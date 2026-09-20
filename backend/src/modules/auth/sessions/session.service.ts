import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthSession } from './auth-session.entity.js';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(AuthSession)
    private readonly sessionRepository: Repository<AuthSession>,
  ) {}

  async create(
    userId: string,
    refreshHash: string,
    expiresAt: Date,
    options: { device?: string | null; userAgent?: string | null; ip?: string | null } = {},
  ): Promise<AuthSession> {
    const session = this.sessionRepository.create({
      userId,
      refreshHash,
      expiresAt,
      device: options.device ?? null,
      userAgent: options.userAgent ?? null,
      ip: options.ip ?? null,
      lastUsedAt: new Date(),
    });
    return this.sessionRepository.save(session);
  }

  findById(id: string): Promise<AuthSession | null> {
    return this.sessionRepository.findOne({ where: { id } });
  }

  async findValidById(id: string, userId: string): Promise<AuthSession | null> {
    const session = await this.sessionRepository.findOne({
      where: { id, userId },
    });
    if (!session || session.expiresAt < new Date()) {
      return null;
    }
    return session;
  }

  listForUser(userId: string): Promise<AuthSession[]> {
    return this.sessionRepository.find({
      where: { userId },
      order: { lastUsedAt: 'DESC' },
    });
  }

  listActiveForUser(userId: string): Promise<AuthSession[]> {
    return this.sessionRepository
      .createQueryBuilder('session')
      .where('session.userId = :userId', { userId })
      .andWhere('session.expiresAt > :now', { now: new Date() })
      .orderBy('session.lastUsedAt', 'DESC')
      .getMany();
  }

  async rotate(
    id: string,
    newRefreshHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.sessionRepository.update(id, {
      refreshHash: newRefreshHash,
      expiresAt,
      lastUsedAt: new Date(),
    });
  }

  async deleteByIdAndUser(id: string, userId: string): Promise<boolean> {
    const result = await this.sessionRepository.delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.sessionRepository.delete({ userId });
  }
}