import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('PG_CONNECTION') private db: any,
    private prisma: PrismaService,
  ) { }

  private users: any[] = [];

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    return user;
  }

  async insertUser(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: user
    });
    return newUser;
  }

  async updateUser(id: number, userUpdate: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: {id: id},
      data:userUpdate 
    });
    return user;
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.delete({
      where: {id}
    });
    return user;
  }
}
