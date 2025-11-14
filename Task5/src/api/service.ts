import { API_URL } from '../shared/constants';
import type { Task } from '../types';
import { Status, Priority } from '../types';
class TaskService {
    private validateTask(task: Task, isUpdate: boolean = false): void {
        if (!isUpdate && !task.id) {
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
            return fetch(`${API_URL}/tasks/${id}`).then(res => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTasks(): Promise<Task[]> {
        try {
            return fetch(`${API_URL}/tasks`).then(res => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async createTask(task: Task): Promise<Task> {
        this.validateTask(task);
        try {
            return fetch(`${API_URL}/tasks`, {
                method: 'POST',
                    body: JSON.stringify(task),
                }).then(res => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateTask(id: string, task: Task): Promise<Task> {
        this.validateTask(task, true);
        try {   
            return fetch(`${API_URL}/tasks/${id}`, {
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
            return fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
            }).then(res => res.json());
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new TaskService();