import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/role.guard';
import Roles from '../decorators/roles.decorator';
import { RoleEnum } from '../etc/enums';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import ResponseObject from '../etc/response-object';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Controller('accounts')
@ApiTags('accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('get-all')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async getAll() {
    const [accounts, err] = await this.accountsService.getAll();
    if (!accounts) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Get all accounts failed!', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Get all accounts success!', accounts, null);
  }

  @Get('get-one/:id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async getById(@Param('id') id: string) {
    const account = await this.accountsService.getById(id);
    if (!account) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Get account failed!',null, 'check ID again');
    }
    return new ResponseObject(HttpStatus.OK, 'Get account success!', account, null);
  }

  @Post('create-one')
  async createOne(@Body() info: CreateAccountDto) {
    const [account, err] = await this.accountsService.createOne(info);
    if (!account) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Create account failed!', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Create account success!', account, null);
  }

  @Post('update-one/:id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async updateOne(@Param('id') id: string, @Body() info: UpdateAccountDto) {
    const [account, err] = await this.accountsService.updateOne(id, info);
    if (!account) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Update account failed!', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Update account success!', account, null);
  }

  @Post('toggle-active/:id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async toggleActive(@Param('id') id: string) {
    const [account, err] = await this.accountsService.toggleActive(id);
    if (!account) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Toggle active account failed!', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Toggle active account success!', account, null);
  }
}
