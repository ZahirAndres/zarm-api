import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update.task.dto';
@Injectable({})
export class TaskService {
  constructor(@Inject('PG_CONNECTION') private db: any) {}

  private tasks: any[] = [];

  async getTasks() {
    const query = 'SELECT * FROM tasks';
    const result = await this.db.query(query);
    return result.rows;
  }

  async getTaskById(id: number): Promise<Task> {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0];
  }

  async insertTask(task: CreateTaskDto): Promise<Task> {
    const sql = `
    INSERT INTO tasks (name, description, priority, user_id)
    VALUES ('${task.name}', '${task.description}', ${task.priority}, ${task.user_id})
    RETURNING id
  `;

    const result = await this.db.query(sql);

    const insertId = result.rows[0].id;
    return await this.getTaskById(insertId);
  }

  async updateTask(id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);

    task.name = taskUpdate.name ? taskUpdate.name : task.name;
    task.description = taskUpdate.description ?? task.description;
    task.priority = taskUpdate.priority ?? task.priority;
    const query = `UPDATE tasks SET 
    name = '${task.name}',
    description = '${task.description}',
    priority = ${task.priority}
    WHERE id = ${task.id}`;
    // pg client returns a result object, not an array
    const result = await this.db.query(query);
    const affectedRows = result.rowCount; // rowCount indicates how many rows were modified
    console.log('updated rows:', affectedRows);
    // convertir el objeto an un set
    // { name : 'abc', description: 'abc'}
    // name = '', description = ''
    // const sets = Object.keys(taskUpdate)
    // .map(key => `${key} = '${taskUpdate[key]}'`).join(', ');
    return this.getTaskById(id);
  }

  async deleteTask(id: number): Promise<boolean> {
    const query = `DELETE FROM tasks WHERE id = ${id}`;
    const result = await this.db.query(query);

    return result.rowCount > 0;
  }
}
