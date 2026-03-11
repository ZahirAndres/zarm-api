import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: "Verifica las credenciales y genera un JWT y un RefreshToken"})
  public login(): string {
    return this.authSvc.login();
  }

  @Get("me")
  @ApiOperation({ summary: "Extrae el ID del usuario desde el token y busca la información"})
  public getProfile(){

  }

  public refreshToken(){

  }

  public logout() {

  }
}
