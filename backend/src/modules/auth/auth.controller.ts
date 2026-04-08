import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.user.dto';
import { UtilService } from 'src/common/services/util.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AppException } from 'src/common/exception/app.exception';
import { RefreshAuthGuard } from 'src/common/guards/refresh.auth.guard';
import { AllExceptionFilter } from 'src/common/filters/http-exceptions.filter';

@Controller('api/auth')
export class AuthController {
  
  constructor(private authSvc: AuthService, private utilSvc: UtilService, private jwtSrv: JwtService) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verifica las credenciales y genera un JWT y un RefreshToken" })
  public async login(@Body() user: LoginUserDto): Promise<Object | null> {
    const result = await this.authSvc.getUserByUsername(user.username);

    if (result == undefined)
      throw new HttpException('Credenciales incorrectas', HttpStatus.UNAUTHORIZED);

    const passwordDB = result.password || "";
    const validate_pass = await this.utilSvc.checkPassword(user.password, passwordDB);

    if (!validate_pass)
      throw new HttpException('Credenciales incorrectas', HttpStatus.UNAUTHORIZED);

    const payload: any = { 
      id: result.id,
      name: result.name,
      username: result.username,
      lastname: result.lastname,
      rol_id: result.rol_id,
      created_date: result.created_at,
    }

    const refresh_exp = Math.floor(Date.now() / 1000) + (Number(process.env.JWT_REFRESH_EXP_SECONDS));
    payload.refresh_exp = refresh_exp;

    var refreshToken = await this.utilSvc.generateJWT(payload, process.env.JWT_REFRESH_EXPIRES_IN);
    
    const hash = await this.utilSvc.hash(refreshToken);
    await this.authSvc.updateHash(result.id, hash);

    payload.hash = hash;
    refreshToken = hash; // Retornamos el hash como Refresh Token para el cliente

    const accessToken = await this.utilSvc.generateJWT(payload, process.env.JWT_ACCESS_EXPIRES_IN);

    return { 
      accessToken,
      refreshToken
    }
  }

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Extrae el ID del usuario desde el token y busca la información" })
  public getProfile(@Req() request: any) {
    const { hash, iat, exp, ...profile } = request['user'];
    return profile;
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard) 
  public async refreshToken(@Req() request: any) {
    const userSession = request['user'];

    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > userSession.refresh_exp) {
      throw new AppException('Refresh Token expirado', HttpStatus.FORBIDDEN, '0');
    }

    const user = await this.authSvc.getUserById(userSession.id);
    if (!user || !user.hash) throw new AppException('Acceso denegado', HttpStatus.FORBIDDEN, '0');

    if (!(user.hash === userSession.hash)) throw new AppException('Token inválido', HttpStatus.FORBIDDEN, '0');

    const payload: any = {
      id: user.id,
      name: user.name,
      username: user.username,
      lastname: user.lastname,
      rol_id: user.rol_id,
      created_date: user.created_at,
    };

    const refreshTimeInSeconds = Number(process.env.JWT_REFRESH_EXP_SECONDS);
    payload.refresh_exp = Math.floor(Date.now() / 1000) + refreshTimeInSeconds;

    let refreshToken = await this.utilSvc.generateJWT(payload, process.env.JWT_REFRESH_EXPIRES_IN);
    const hash = await this.utilSvc.hash(refreshToken);
    await this.authSvc.updateHash(user.id, hash);

    payload.hash = hash;
    const accessToken = await this.utilSvc.generateJWT(payload, process.env.JWT_ACCESS_EXPIRES_IN);

    return {
      accessToken,
      refreshToken: hash
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshAuthGuard)
  public async logout(@Req() request: any): Promise<void> {
    const session = request['user'];
    await this.authSvc.updateHash(session.id, null);
  }

  // Controlador para probar los logs
  @Get('test-logs')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Prueba los logs' })
  public async testLogs(@Req() request: any) {
    const user = request['user'];
    throw new HttpException('Error de prueba para el regitro de logs', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}