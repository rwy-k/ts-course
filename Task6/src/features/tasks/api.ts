import { API_URL } from '@/shared/constants';
import type { Task } from './types';
import { Status, Priority } from './types';
export class TaskService {
    private readonly API_URL = `${API_URL}/tasks`;
    private validateTask(task: Task): void {
        if (!task.id) {
            throw new Error('Id is required');
        }
        if (!task.title || !task.deadline || !task.status || !task.priority) {
            throw new Error('Title, deadline, status and priority are required');
        }
        if (task.deadline < new Date()) {
            throw new Error('Deadline must be in the future');
        }
        if (!Object.values(Status).includes(task.status)) {
            throw new Error('Invalid status: ' + task.status);
        }
        if (!Object.values(Priority).includes(task.priority)) {
            throw new Error('Invalid priority: ' + task.priority);
        }
    }
    async getTaskById(id: string): Promise<Task> {
        try {
            return fetch(`${this.API_URL}/${id}`).then(res => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTasks(): Promise<Task[]> {
        try {
            return fetch(`${this.API_URL}`).then(res => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async createTask(task: Task): Promise<Task> {
        this.validateTask(task);
        try {
            return fetch(`${this.API_URL}`, {
                method: 'POST',
                    body: JSON.stringify(task),
                }).then(res => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateTask(task: Task): Promise<Task> {
        this.validateTask(task);
        try {   
            return fetch(`${this.API_URL}/${task.id}`, {
                method: 'PUT',
                body: JSON.stringify(task),
            }).then(res => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async deleteTaskById(id: string): Promise<void> {
        try {
            return fetch(`${this.API_URL}/${id}`, {
                method: 'DELETE',
            }).then(res => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new TaskService();