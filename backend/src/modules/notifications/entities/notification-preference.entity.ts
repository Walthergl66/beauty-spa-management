import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @Column({ name: 'appointment_created', default: true })
  appointmentCreated: boolean;

  @Column({ name: 'appointment_confirmed', default: true })
  appointmentConfirmed: boolean;

  @Column({ name: 'appointment_cancelled', default: true })
  appointmentCancelled: boolean;

  @Column({ name: 'appointment_rescheduled', default: true })
  appointmentRescheduled: boolean;

  @Column({ name: 'reminders', default: true })
  reminders: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}