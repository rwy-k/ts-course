import { API_URL } from '@/shared/constants';
import type { Task } from '@/features/tasks/types';
import { Status, Priority, TaskType } from '@/features/tasks/enums';
export class TaskService {
    private readonly API_URL = `${API_URL}/tasks`;
    private validateTask(task: Task): void {
        if (!task.id) {
            throw new Error('Id is required');
        }
        if (!task.title || !task.deadline || !task.status || !task.priority) {
            throw new Error('Title, deadline, status and priority are required');
        }
        if (task.deadline < new Date(task.createdAt as Date)) {
            throw new Error('Deadline must be after creation date');
        }
        if (!Object.values(Status).includes(task.status)) {
            throw new Error('Invalid status: ' + task.status);
        }
        if (!Object.values(Priority).includes(task.priority)) {
            throw new Error('Invalid priority: ' + task.priority);
        }
        if (!Object.values(TaskType).includes(task.type)) {
            throw new Error('Invalid task type: ' + task.type);
        }
    }
    async getTaskById(id: string): Promise<Task> {
        try {
            const response = await fetch(`${this.API_URL}/${id}`);
            const task = await response.json();

            return {
                ...task,
                deadline: new Date(task.deadline),
                createdAt: new Date(task.createdAt),
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTasks(): Promise<Task[]> {
        try {
            const response = await fetch(`${this.API_URL}`);
            const tasks = await response.json();

            return tasks.map((task: Task) => ({
                ...task,
                deadline: new Date(task.deadline),
                createdAt: new Date(task.createdAt),
            }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createTask(task: Task): Promise<Task> {
        this.validateTask(task);
        try {
            const response = await fetch(`${this.API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create task: ${response.status} - ${errorText}`);
            }

            const createdTask = await response.json();

            return {
                ...createdTask,
                deadline: new Date(createdTask.deadline),
                createdAt: new Date(createdTask.createdAt),
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateTask(id: string, task: Task): Promise<Task> {
        this.validateTask(task);
        if (task.id !== id) {
            throw new Error('Id mismatch: ' + task.id + ' !== ' + id);
        }
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update task: ${response.status} - ${errorText}`);
            }

            const updatedTask = await response.json();
            // Convert date strings to Date objects
            return {
                ...updatedTask,
                deadline: new Date(updatedTask.deadline),
                createdAt: new Date(updatedTask.createdAt),
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteTaskById(id: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete task: ${response.status} - ${errorText}`);
            }

            if (response.status !== 204 && response.headers.get('content-length') !== '0') {
                await response.json();
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default new TaskService();
