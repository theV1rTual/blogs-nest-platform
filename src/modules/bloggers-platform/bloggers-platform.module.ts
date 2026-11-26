import { Module } from '@nestjs/common';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BlogsService } from './blogs.service';
@Module({
  imports: [UserAccountsModule],
  providers: [BlogsService],
})
export class BloggersPlatformModule {}
