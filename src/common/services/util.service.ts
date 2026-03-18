import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcryp from 'bcrypt';

@Injectable()
export class UtilService {
constructor ( private jwtSrv: JwtService ){ }

 public async hashPassword(password: string): Promise<string> {
    return await bcryp.hash(password, 10);
 }

 public async checkPassword(password: string, hash: string): Promise<boolean> {
    return await bcryp.compareSync(password, hash)
 }

 public async generateJWT(payload: any, expiresIn: any = '60s'): Promise<string> {
   return await this.jwtSrv.signAsync(payload, { 
    secret: process.env.JWT_SECRET,
    expiresIn: expiresIn
  });
 }

 public async getPayloadJWT(token: string): Promise<any>{
   try {
     return await this.jwtSrv.verifyAsync(token, {secret: process.env.JWT_SECRET});
   } catch (error) {
     return null;
   }
 }
}