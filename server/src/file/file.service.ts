import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  /**
   * Generate upload URL for cloud storage
   * In production, this would integrate with services like:
   * - AWS S3 with pre-signed URLs
   * - Cloudinary
   * - Firebase Storage
   * - etc.
   */
  async getUploadUrl(fileType: string, fileName: string) {
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
    ];

    if (!allowedTypes.includes(fileType)) {
      throw new BadRequestException('File type not allowed');
    }

    // Generate unique filename
    const uniqueId = uuidv4();
    const extension = fileType.split('/')[1];
    const cloudFileName = `uploads/${uniqueId}.${extension}`;

    // In production, generate pre-signed URL from cloud provider
    // For now, return a placeholder structure
    return {
      uploadUrl: `https://storage.example.com/upload/${uniqueId}`,
      fileName: cloudFileName,
      publicUrl: `https://cdn.example.com/${cloudFileName}`,
      // Note: In production, implement actual cloud storage integration
      // Example for AWS S3:
      // const s3Url = await s3.getSignedUrlPromise('putObject', { ... })
    };
  }

  /**
   * Validate external URL (for document/image link fields)
   */
  validateExternalUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
