import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { FileService } from './file.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('upload-url')
  @UseGuards(JwtAuthGuard)
  getUploadUrl(
    @Query('type') fileType: string,
    @Query('name') fileName: string,
    @Request() req,
  ) {
    return this.fileService.getUploadUrl(fileType, fileName);
  }

  @Get('validate-url')
  @UseGuards(JwtAuthGuard)
  validateUrl(@Query('url') url: string) {
    const isValid = this.fileService.validateExternalUrl(url);
    return { valid: isValid };
  }
}
