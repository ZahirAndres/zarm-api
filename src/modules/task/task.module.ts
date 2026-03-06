import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { pgProvider } from 'src/common/providers/pg.providers';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, pgProvider[0]],
})
export class TaskModule { }
