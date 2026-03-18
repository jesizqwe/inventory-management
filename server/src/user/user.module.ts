import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalesforceModule } from 'src/salesforce/salesforce.module';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  imports: [SalesforceModule],
  exports: [UserService]
})
export class UserModule {}
