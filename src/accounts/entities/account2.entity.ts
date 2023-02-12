import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Account2 {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}