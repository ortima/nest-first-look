import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, CategoryModule, TransactionModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
