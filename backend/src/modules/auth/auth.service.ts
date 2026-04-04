import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { User } from '../user/entities/user.entity';

@Injectable({})
export class AuthService {

  constructor(
    private prisma: PrismaService,
  ) { }

  async getUserByUsername(username: string): Promise<User | null> {
    const result = await this.prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: false,
        password: true,
        created_at: true,
        rol_id: true
      }
    })
    return result;
  }

  public async getUserById(id: number):  Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { id }
    })
  }

   public async updateHash(id: number, hash: string | null): Promise<User | null> {
    return await this.prisma.user.update({
      where: { id },
      data: { hash: hash ?? '' }
    })
  }


}
