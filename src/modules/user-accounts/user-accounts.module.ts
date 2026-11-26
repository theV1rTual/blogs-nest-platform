import { Module } from '@nestjs/common';
import { UserAccountsController } from './api/user-accounts.controller';
import { UserAccountsService } from './application/user-accounts.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, UsersQueryRepository, UsersExternalRepository,
        UsersExternalService,],
    exports: [UsersExternalRepository, UsersExternalService], //тут указываем какие провайдеры будут доступны в другом модуле в случае импорта
})
export class UserAccountsModule {}
