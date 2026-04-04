import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update.user.dto';
import { Task } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getUsers(currentUserId:number): Promise<User[]> {
    const user = await this.prisma.user.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_at: true,
        rol_id: true,
      },
      where: {
        id: {
          not: currentUserId
        }
      }
    });
    return user
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_at: true,
        rol_id: true,
      }

    });
    return user;
  }

  async getUserByNameUser(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_at: true,
        rol_id: true,
      }

    });
    return user;
  }

  async insertUser(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        hash: ''
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_at: true,
        rol_id: true,
      }
    });
    return newUser;
  }

  async updateUser(id: number, userUpdate: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: userUpdate,
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_at: true,
        rol_id: true,
      }
    });
    return user;
  }

  async deleteUser(id: number): Promise<Boolean> {
    try {
      await this.prisma.user.delete({
        where: { id }
      });
    } catch {
      return false;
    }
    return true;
  }

  async getTaskById(id: number): Promise<Task[]> {
    const task = await this.prisma.task.findMany({
      where: { user_id: id }
    });
    return task;
  }
}
