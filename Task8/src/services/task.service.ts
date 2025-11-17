import { type ITaskUpdate, type ITaskFilter, type ITask } from '../types/task.types.js';
import Task from '../models/Task.model.js';
import { Op } from 'sequelize';
import { CustomError } from '../utils/customErrors.js';

export class TaskService {
    private taskModel: typeof Task;
    constructor() {
        this.taskModel = Task;
    }


    async getTasks(filterBy: ITaskFilter) {
        const where = Object.entries(filterBy).reduce((acc, [key, value]) => {
            if (value && key === 'createdAt') {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    throw new Error('Invalid createdAt date');
                }
                acc[key] = { [Op.gte]: date };
            } else if (value) {
                acc[key] = { [Op.eq]: value };
            }
            return acc;
        }, {} as Record<string, { [key: string]: string | Date }>);

        const tasks = await this.taskModel.findAll({ where: { [Op.and]: [where] } });
        return tasks;
    }

    async getTaskById(id: string) {
        const task = await this.taskModel.findByPk(id);
        if (!task) {
            throw new CustomError('Task not found', 404);
        }
        return task;
    }

    async createTask(task: Omit<ITask, 'id' | 'createdAt'>) {
        return await this.taskModel.create(task);
    }

    async deleteTask(id: string) {
        const task = await this.taskModel.findByPk(id);
        if (!task) {
            throw new CustomError('Task not found', 404);
        }
        return await this.taskModel.destroy({ where: { id } });
    }

    async updateTask(id: string, newTask: ITaskUpdate) {
        const task = await this.taskModel.findByPk(id);
        if (!task) {
            throw new CustomError('Task not found', 404);
        } else {
            if (newTask.deadline && new Date(newTask.deadline) < new Date(task.createdAt)) {
                throw new CustomError('Deadline must be after creation date', 400);
            }
            await this.taskModel.update({ ...newTask }, { where: { id } });
            const updatedTask = await this.taskModel.findByPk(id);
            return updatedTask;
        }
    }
}