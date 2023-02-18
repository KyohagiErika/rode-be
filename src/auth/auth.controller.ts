import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Account } from '../accounts/entities/account.entity';
import CurrentAccount from '../decorators/current-account.decorator';
import ResponseObject from '../etc/response-object';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('get-info-from-google/:credential')
  @ApiParam({ name: 'credential' })
  async getInfoFromGoogle(@Param('credential') credential: string) {
    const [info, err] = await this.authService.getInfoFromGoogle(credential);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get info from google failed',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Get info from google success',
      info,
      null,
    );
  }

  @Get('login/:credential')
  @ApiParam({ name: 'credential' })
  async login(@Param('credential') credential: string) {
    const [account, err] = await this.authService.googleLogin(credential);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Login failed',
        null,
        err,
      );
    }
    if (!account) {
      return new ResponseObject(
        HttpStatus.NOT_FOUND,
        'Login failed',
        null,
        'Account not found',
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Login success', account, null);
  }

  @Get('self')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async self(@CurrentAccount() account: Account) {
    return account;
  }
}
