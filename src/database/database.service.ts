import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@accounts/entities/account.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from '../etc/enums';
import RodeConfig from '../etc/config';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async loadAdmin() {
    const admin = await this.accountRepository.findOne({
      where: {
        email: RodeConfig.ADMIN_EMAIL,
      },
    });
    if (!admin) {
      await this.accountRepository.delete({
        role: RoleEnum.ADMIN,
      });
      await this.accountRepository.save({
        fname: 'Admin',
        lname: '',
        sname: '',
        email: RodeConfig.ADMIN_EMAIL,
        dob: new Date(),
        phone: '',
        studentId: '',
        role: RoleEnum.ADMIN,
      });
    }
  }
}
