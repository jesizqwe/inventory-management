import { Injectable, Logger } from '@nestjs/common';
import * as jsforce from 'jsforce';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';

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

interface SalesforceTokenResponse {
  access_token: string;
  instance_url: string;
}

@Injectable()
export class SalesforceService {
  private readonly logger = new Logger(SalesforceService.name);
  private conn: jsforce.Connection | null = null;
  private accessToken: string | null = null;
  private instanceUrl: string | null = null;

  constructor(private configService: ConfigService) {}

  /**
   * Authenticate with Salesforce using OAuth 2.0 Client Credentials Flow
   */
  async authenticate(): Promise<void> {
    const clientId = this.configService.get<string>('SALESFORCE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('SALESFORCE_CLIENT_SECRET');
    const loginUrl = this.configService.get<string>('SALESFORCE_LOGIN_URL') || 'https://login.salesforce.com';

    if (!clientId || !clientSecret) {
      throw new Error('Salesforce credentials are not configured');
    }

    try {
      // Get access token using client credentials
      const tokenResponse = await this.getClientCredentialsToken(
        loginUrl,
        clientId,
        clientSecret,
      );

      this.accessToken = tokenResponse.access_token;
      this.instanceUrl = tokenResponse.instance_url;

      // Create connection with the access token
      this.conn = new jsforce.Connection({
        instanceUrl: this.instanceUrl,
        accessToken: this.accessToken,
      });

      this.logger.log('Successfully authenticated with Salesforce');
    } catch (error: any) {
      this.logger.error('Failed to authenticate with Salesforce', error);
      throw new Error(`Salesforce authentication failed: ${error.message}`);
    }
  }

  /**
   * Get access token using Client Credentials Flow
   */
  private async getClientCredentialsToken(
    loginUrl: string,
    clientId: string,
    clientSecret: string,
  ): Promise<SalesforceTokenResponse> {
    return new Promise((resolve, reject) => {
      const url = `${loginUrl}/services/oauth2/token`;
      const body = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

      const req = https.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': body.length,
        },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.access_token) {
              resolve(response);
            } else {
              reject(new Error(response.error_description || 'No access token received'));
            }
          } catch (e) {
            reject(new Error(`Invalid response: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  /**
   * Get or create connection
   */
  private async getConnection(): Promise<jsforce.Connection> {
    if (!this.conn || !this.accessToken) {
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
