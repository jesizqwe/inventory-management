import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSalesforceRecordDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  companyWebsite?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
