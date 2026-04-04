import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.user.dto';
import { User } from '../user/entities/user.entity';
import { UtilService } from 'src/common/services/util.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AppException } from 'src/common/exception/app.exception';

@Controller('api/auth')
export class AuthController {
    
  constructor(private authSvc: AuthService, private utilSvc: UtilService,private jwtSrv: JwtService) { }

  // Agregar por medio del body username y password a login() !
  // verificar el username en la base de datos, si existe devolver el objeto user !
  // si el usuairo no existe devolver un unautorizedException 401? trown !
  // en caso de que exista revisar la contraseña dentro del método checkpassword() en Utils !
  // si es true -> contraseña correcta, si sucede esto se genera un token de acceso por 60 segundos
  // luego otro token "RefreshToken" que vencerá en 7 días el cual debe de guardarse en la base de datos
  // el payload es el [id, name, lastname, created_date] retornar el acces token y el refresh token en un solo object
  /**
   * 
   * {
   *  accesToken:"",
   *  refreshToken: ""
   * }
   */
  // seguir la documentación de Nest/Segurity/Authorization/JWT token
  // Dos metodos util.service uno para obtener el payload del token y otro para generar el token
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verifica las credenciales y genera un JWT y un RefreshToken" })
  public async login(@Body() user: LoginUserDto): Promise<Object | null> {
    const result = await this.authSvc.getUserByUsername(user.username);

    if(result == undefined)
      throw new HttpException('Credenciales incorrectas', HttpStatus.UNAUTHORIZED)

    const passwordDB = result.password || "";
    const validate_pass = await this.utilSvc.checkPassword(user.password, passwordDB);

    if(!validate_pass)
      throw new HttpException('Credenciales incorrectas', HttpStatus.UNAUTHORIZED);

    const payload: any = { 
      id: result.id,
      name: result.name,
      lastname: result.lastname,
      rol_id: result.rol_id,
      created_date: result.created_at,
    }
    var refreshToken = await this.utilSvc.generateJWT(payload, '7d');
    const hash = await this.utilSvc.hash(refreshToken);
    await this.authSvc.updateHash(result.id, hash)

    payload.hash = hash;
    refreshToken = hash;

    const accessToken = await this.utilSvc.generateJWT(payload, '1h');


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
    return profile
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async refreshToken(@Req() request: any) {
    // Obtener el usuario en sesión
    const userSession = request['user'];
    const user = await this.authSvc.getUserById(userSession.id)
    if(!user || !user.hash) throw new AppException('Acceso Denegado',HttpStatus.FORBIDDEN, '0')
    // Comparar el token recibido con el token guardado (comparación constante en tiempo)
    const isValidHash = await this.utilSvc.checkPassword(userSession.hash, user.hash);
    if(!isValidHash) throw new AppException('Token inválido', HttpStatus.FORBIDDEN, '0')

    // Si el token es válido se generan nuevos tokens
    const payload: any = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      created_date: user.created_at,
    };

    // Generar nuevo refresh token (7 días)
    let refreshToken = await this.utilSvc.generateJWT(payload, '7d');
    const hash = await this.utilSvc.hash(refreshToken);
    await this.authSvc.updateHash(user.id, hash);

    // Generar nuevo access token (1 hora) con el hash en el payload
    payload.hash = hash;
    const accessToken = await this.utilSvc.generateJWT(payload, '1h');

    return {
      accessToken,
      refreshToken: hash
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any): Promise<void> {
    const session = request['user'];
    await this.authSvc.updateHash(session.id, null);
  }
}
