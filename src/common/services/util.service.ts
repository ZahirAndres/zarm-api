import { Injectable } from "@nestjs/common";
import * as bcryp from 'bcrypt';

@Injectable()
export class UtilService {
 public async hashPassword(password: string): Promise<string> {
    return await bcryp.hash(password, 10);
 }

 public async checkPassword(password: string, hash: string): Promise<boolean> {
    return await bcryp.compareSync(password, hash)
 }
}