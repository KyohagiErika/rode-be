import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    AuthModule,
    AccountsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
