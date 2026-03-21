import { Body, Controller, Get, Param, Post, UseGuards, Request, Patch, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SalesforceService } from 'src/salesforce/salesforce.service';
import { CreateSalesforceRecordDto } from './dto/create-salesforce-record.dto';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly salesforceService: SalesforceService,
  ) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll()
  }

  @Get('by-id/:id')
  findById(@Param('id') id: string) {
    return this.userService.findById(Number(id))
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.userService.findById(req.user.id)
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() data: { name?: string; avatarUrl?: string }) {
    return this.userService.updateProfile(req.user.id, data)
  }

  @Post('salesforce/create')
  @UseGuards(JwtAuthGuard)
  async createSalesforceRecord(
    @Request() req,
    @Body() dto: CreateSalesforceRecordDto,
  ) {
    try {
      const user = await this.userService.findById(req.user.id);

      // Build Account name from user data
      const accountName = dto.companyName || `${user.name}'s Company`;
      const accountEmail = dto.email || user.email;

      // Create Account and Contact in Salesforce
      const result = await this.salesforceService.createAccountWithContact(
        {
          Name: accountName,
          Email: accountEmail,
          Phone: dto.phone,
          Website: dto.companyWebsite,
          Description: dto.description || `Account for user ${user.name} (${user.email})`,
        },
        {
          FirstName: dto.firstName,
          LastName: dto.lastName,
          Email: dto.email || user.email,
          Phone: dto.phone,
          Description: dto.description || `Contact for user ${user.name}`,
        },
      );

      return {
        success: true,
        accountId: result.accountId,
        contactId: result.contactId,
        message: 'Account and Contact created successfully in Salesforce',
      };
    } catch (error: any) {
      this.logger.error('Failed to create Salesforce record', error);
      throw new Error(`Failed to create Salesforce record: ${error.message}`);
    }
  }

  @Get('salesforce/status')
  @UseGuards(JwtAuthGuard)
  async getSalesforceStatus() {
    const isConnected = await this.salesforceService.isConnected();
    return { connected: isConnected };
  }
}
