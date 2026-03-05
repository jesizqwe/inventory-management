import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { InventoryModule } from './inventory/inventory.module';
import { ItemModule } from './item/item.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { TagModule } from './tag/tag.module';
import { SearchModule } from './search/search.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    AdminModule,
    InventoryModule,
    ItemModule,
    CommentModule,
    LikeModule,
    TagModule,
    SearchModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
