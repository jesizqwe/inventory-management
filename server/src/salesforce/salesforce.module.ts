import { Module } from '@nestjs/common';
import { SalesforceService } from './salesforce.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SalesforceService],
  exports: [SalesforceService],
})
export class SalesforceModule {}
