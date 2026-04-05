import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from "@nestjs/common";
import { Request } from 'express';
import { UtilService } from "../services/util.service";

@Injectable()
export class RefreshAuthGuard implements CanActivate {

    constructor(private utilSrv: UtilService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) throw new UnauthorizedException();
        
        try {
            const payload = await this.utilSrv.getPayloadRefreshJWT(token);
            if (!payload) {
                throw new UnauthorizedException();
            }
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