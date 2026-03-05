import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, MinLength, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { InventoryCategory } from 'src/generated/client';

class CustomFieldDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  enabled: boolean;

  @IsBoolean()
  @IsOptional()
  showInTable?: boolean;
}

class CustomFieldsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldDto)
  string1?: CustomFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldDto)
  string2?: CustomFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldDto)
  string3?: CustomFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldDto)
  int1?: CustomFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldDto)
  int2?: CustomFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldDto)
  int3?: CustomFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldDto)
  bool1?: CustomFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldDto)
  bool2?: CustomFieldDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldDto)
  bool3?: CustomFieldDto;
}

export class CreateInventoryDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(InventoryCategory)
  @IsOptional()
  category?: InventoryCategory;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsArray()
  @IsOptional()
  tagIds?: number[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldsDto)
  customFields?: CustomFieldsDto;

  @IsString()
  @IsOptional()
  customIdPattern?: string;
}

export class UpdateInventoryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(InventoryCategory)
  @IsOptional()
  category?: InventoryCategory;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsArray()
  @IsOptional()
  tagIds?: number[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldsDto)
  customFields?: CustomFieldsDto;

  @IsString()
  @IsOptional()
  customIdPattern?: string;
}

export class AddAccessDto {
  @IsString()
  email: string;
}

export class RemoveAccessDto {
  @IsString()
  userId: string;
}
