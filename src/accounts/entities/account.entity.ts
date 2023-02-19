import { RoleEnum } from '../../etc/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fname: string;

  @Column()
  lname: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  studentId: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  dob: Date;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ default: true })
  isActive: boolean;
}
