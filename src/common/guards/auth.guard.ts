import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from "@nestjs/common";
import { Request } from 'express';
import { UtilService } from "../services/util.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private utilSrv: UtilService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Obtener el request de la peticion
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        // Verficar que existe el token
        if (!token)
            throw new UnauthorizedException();
        try {
            // Si el token existe verficar el tiempo de expiración
            const payload = await this.utilSrv.getPayloadJWT(token)
            if (!payload) {
                throw new UnauthorizedException();
            }
            // Si el token es funcional agregar el user(payload)
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}