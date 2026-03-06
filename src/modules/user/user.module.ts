import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { pgProvider } from 'src/common/providers/pg.providers';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, pgProvider[0]],
})
export class UserModule { }
