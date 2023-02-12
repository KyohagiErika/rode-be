import { RoleEnum } from "../../etc/enums";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fname: string;

    @Column()
    lname: string;

    @Column()
    email: string;

    @Column()
    studentId: string;

    @Column()
    phone: string;

    @Column()
    dob: Date;

    @Column({ enum: RoleEnum, default: RoleEnum.USER })
    role: RoleEnum;
}