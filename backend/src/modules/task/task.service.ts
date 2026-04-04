import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update.task.dto';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getTasks(user_id: number) {
    return this.prisma.task.findMany({
      where: {
        user_id
      }
    });
  }

  async getTaskById(id: number, user_id:number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id , user_id}
    });
    return task;
  }

  async insertTask(task: CreateTaskDto): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: task
    });
    return newTask;
  }

  // async updateTask(id: number, taskUpdate: UpdateTaskDto, user_id: number): Promise<Task> {
  //   const task = await this.prisma.task.update({
  //     where: { id: id, user_id },
  //     data: taskUpdate
  //   });
  //   return task;
  // }

  // async deleteTask(id: number, user_id: number): Promise<Task> {
  //   const task = await this.prisma.task.delete({
  //     where: { id, user_id }
  //   });
  //   return task;
  // }

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
