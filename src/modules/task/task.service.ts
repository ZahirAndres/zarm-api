import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update.task.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject('PG_CONNECTION') private db: any,
    private prisma: PrismaService,
  ) { }

  private tasks: any[] = [];

  async getTasks() {
    return this.prisma.task.findMany();
  }

  async getTaskById(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id }
    });
    return task;
  }

  async insertTask(task: CreateTaskDto): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: task
    });
    return newTask;
  }

  async updateTask(id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.update({
      where: {id: id},
      data: taskUpdate
    });
    return task;
  }

  async deleteTask(id: number): Promise<Task> {
    const task = await this.prisma.task.delete({
      where: {id}
    });
    return task;
  }
}
