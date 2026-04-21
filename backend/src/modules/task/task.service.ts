import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update.task.dto';
import { User } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getTasks(user: User) {
    if (user.rol_id === 1) {
      // Admin ve todas
      return this.prisma.task.findMany();
    } else {
      // Usuario regular ve solo las suyas
      return this.prisma.task.findMany({
        where: { user_id: user.id }
      });
    }
  }

  async getTaskById(id: number, user: User): Promise<Task | null> {
    if (user.rol_id === 1) {
      return this.prisma.task.findUnique({
        where: { id }
      });
    } else {
      const task = await this.prisma.task.findUnique({ where: { id } });
      if (task && task.user_id === user.id) {
        return task;
      }
      return null;
    }
  }

  async insertTask(task: CreateTaskDto): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: task
    });
    return newTask;
  }

  async updateTask(id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id: id }, // Buscamos SOLO por el ID de la tarea
      data: taskUpdate
    });
    return task;
  }

  async deleteTask(id: number): Promise<Task> {
    const task = await this.prisma.task.delete({
      where: { id: id } // Buscamos SOLO por el ID de la tarea
    });
    return task;
  }
}
