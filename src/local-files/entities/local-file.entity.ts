import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LocalFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column({ default: false })
  isUsed: boolean;
}
