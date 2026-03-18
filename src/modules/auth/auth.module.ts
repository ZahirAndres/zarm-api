import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { UtilService } from 'src/common/services/util.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.access_token,
      signOptions: { expiresIn: '60s'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UtilService, JwtService],
})
export class AuthModule {}
