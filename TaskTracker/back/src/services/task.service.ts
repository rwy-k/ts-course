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
        const where = Object.entries(filterBy).reduce(
            (acc, [key, value]) => {
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
            },
            {} as Record<string, { [key: string]: string | Date }>,
        );

        const whereClause = Object.keys(where).length > 0 ? { [Op.and]: [where] } : {};
        const tasks = await this.taskModel.findAll({ where: whereClause });
        return tasks;
    }

    async getTaskById(id: string) {
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new CustomError('Invalid task ID format', 400);
        }

        const task = await this.taskModel.findByPk(id);
        return task;
    }

    async createTask(task: Partial<ITask>) {
        return await this.taskModel.create(task);
    }

    async deleteTask(id: string) {
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new CustomError('Invalid task ID format', 400);
        }

        const task = await this.taskModel.findByPk(id);
        if (!task) {
            throw new CustomError('Task not found', 404);
        }
        return await this.taskModel.destroy({ where: { id } });
    }

    async updateTask(id: string, newTask: ITaskUpdate) {
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new CustomError('Invalid task ID format', 400);
        }

        if (newTask.deadline && newTask.deadline < new Date(newTask.createdAt as Date)) {
            throw new CustomError('Deadline must be after creation date', 400);
        }

        const task = await this.taskModel.findByPk(id);
        if (!task) {
            return await this.taskModel.create({ ...newTask, id, createdAt: new Date() });
        } else {
            await this.taskModel.update({ ...newTask }, { where: { id } });
            const updatedTask = await this.taskModel.findByPk(id);
            return updatedTask;
        }
    }
}
