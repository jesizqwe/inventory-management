import { Injectable, Logger } from '@nestjs/common';
import * as jsforce from 'jsforce';
import { ConfigService } from '@nestjs/config';

export interface SalesforceContactResult {
  id: string;
  success: boolean;
  errors: string[];
}

export interface SalesforceAccountResult {
  id: string;
  success: boolean;
  errors: string[];
}

@Injectable()
export class SalesforceService {
  private readonly logger = new Logger(SalesforceService.name);
  private conn: jsforce.Connection | null = null;

  constructor(private configService: ConfigService) {}

  /**
   * Authenticate with Salesforce using OAuth 2.0 Username-Password Flow
   */
  async authenticate(): Promise<void> {
    const clientId = this.configService.get<string>('SALESFORCE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('SALESFORCE_CLIENT_SECRET');
    const username = this.configService.get<string>('SALESFORCE_USERNAME');
    const password = this.configService.get<string>('SALESFORCE_PASSWORD');
    const loginUrl = this.configService.get<string>('SALESFORCE_LOGIN_URL') || 'https://login.salesforce.com';

    if (!clientId || !clientSecret || !username || !password) {
      throw new Error('Salesforce credentials are not configured');
    }

    try {
      // Create connection using jsforce with username/password flow
      this.conn = new jsforce.Connection({
        oauth2: {
          loginUrl,
          clientId,
          clientSecret,
        },
      });

      await this.conn.login(username, password);

      this.logger.log('Successfully authenticated with Salesforce');
      this.logger.log(`Instance URL: ${this.conn.instanceUrl}`);
    } catch (error: any) {
      this.logger.error('Failed to authenticate with Salesforce', error);
      throw new Error(`Salesforce authentication failed: ${error.message}`);
    }
  }

  /**
   * Get or create connection
   */
  private async getConnection(): Promise<jsforce.Connection> {
    if (!this.conn) {
      await this.authenticate();
    }
    return this.conn!;
  }

  /**
   * Create Account in Salesforce
   */
  async createAccount(accountData: {
    Name: string;
    Phone?: string;
    Email?: string;
    Website?: string;
    Description?: string;
  }): Promise<SalesforceAccountResult> {
    try {
      const conn = await this.getConnection();

      const result = await conn.sobject('Account').create(accountData);

      this.logger.log(`Account created: ${result.id}`);

      return {
        id: result.id || '',
        success: result.success,
        errors: (result.errors || []).map((e: any) => String(e)),
      };
    } catch (error: any) {
      this.logger.error('Failed to create Account', error);
      throw new Error(`Failed to create Salesforce Account: ${error.message}`);
    }
  }

  /**
   * Create Contact in Salesforce
   */
  async createContact(contactData: {
    FirstName: string;
    LastName: string;
    Email?: string;
    Phone?: string;
    AccountId?: string;
    Description?: string;
  }): Promise<SalesforceContactResult> {
    try {
      const conn = await this.getConnection();

      const result = await conn.sobject('Contact').create(contactData);

      this.logger.log(`Contact created: ${result.id}`);

      return {
        id: result.id || '',
        success: result.success,
        errors: (result.errors || []).map((e: any) => String(e)),
      };
    } catch (error: any) {
      this.logger.error('Failed to create Contact', error);
      throw new Error(`Failed to create Salesforce Contact: ${error.message}`);
    }
  }

  /**
   * Create Account and linked Contact
   */
  async createAccountWithContact(accountData: {
    Name: string;
    Phone?: string;
    Email?: string;
    Website?: string;
    Description?: string;
  }, contactData: {
    FirstName: string;
    LastName: string;
    Email?: string;
    Phone?: string;
    Description?: string;
  }): Promise<{
    accountId: string;
    contactId: string;
  }> {
    try {
      const conn = await this.getConnection();

      // Create Account first
      const accountResult = await conn.sobject('Account').create(accountData);

      if (!accountResult.success || !accountResult.id) {
        throw new Error(`Failed to create Account: ${JSON.stringify(accountResult.errors)}`);
      }

      const accountId = accountResult.id;

      // Create Contact linked to Account
      const contactResult = await conn.sobject('Contact').create({
        ...contactData,
        AccountId: accountId,
      });

      if (!contactResult.success || !contactResult.id) {
        // Rollback: delete the Account
        await conn.sobject('Account').destroy(accountId);
        throw new Error(`Failed to create Contact: ${JSON.stringify(contactResult.errors)}`);
      }

      this.logger.log(`Created Account (${accountId}) with Contact (${contactResult.id})`);

      return {
        accountId,
        contactId: contactResult.id,
      };
    } catch (error: any) {
      this.logger.error('Failed to create Account with Contact', error);
      throw new Error(`Failed to create Salesforce records: ${error.message}`);
    }
  }

  /**
   * Verify connection status
   */
  async isConnected(): Promise<boolean> {
    try {
      const conn = await this.getConnection();
      await conn.identity();
      return true;
    } catch {
      return false;
    }
  }
}
