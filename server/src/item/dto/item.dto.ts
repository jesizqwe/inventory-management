import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @IsString()
  @IsOptional()
  customId?: string;

  @IsString()
  @IsOptional()
  customString1?: string;

  @IsString()
  @IsOptional()
  customString2?: string;

  @IsString()
  @IsOptional()
  customString3?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  customInt1?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  customInt2?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  customInt3?: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  customBool1?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  customBool2?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  customBool3?: boolean;
}

export class UpdateItemDto {
  @IsString()
  @IsOptional()
  customId?: string;

  @IsString()
  @IsOptional()
  customString1?: string;

  @IsString()
  @IsOptional()
  customString2?: string;

  @IsString()
  @IsOptional()
  customString3?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  customInt1?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  customInt2?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  customInt3?: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  customBool1?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  customBool2?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  customBool3?: boolean;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  version?: number;
}
