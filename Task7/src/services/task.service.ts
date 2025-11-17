import { type ITask, Status, Priority, TaskType, type ITaskUpdate, ITaskFilter } from '../types/task.types.js';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../utils/customErrors.js';

export class TaskService {
    private tasks: ITask[] = [
        { id: uuidv4(), title: 'Task 1', description: 'Task 1 description', createdAt: new Date(), deadline: new Date(), status: Status.TODO, priority: Priority.LOW, type: TaskType.TASK },
        { id: uuidv4(), title: 'Task 2', description: 'Task 2 description', createdAt: new Date(), deadline: new Date(), status: Status.TODO, priority: Priority.LOW, type: TaskType.TASK },
        { id: uuidv4(), title: 'Task 3', description: 'Task 3 description', createdAt: new Date(), deadline: new Date(), status: Status.TODO, priority: Priority.LOW, type: TaskType.TASK },
    ];

    getTasks(filterBy: ITaskFilter) {
        return this.tasks.filter(task => {
            let isMatch = true;
            if (filterBy?.status) {
                isMatch = isMatch && task.status === filterBy.status;
            }
            if (filterBy?.priority) {
                isMatch = isMatch && task.priority === filterBy.priority;
            }
            if (filterBy?.createdAt) {
                isMatch = isMatch && task.createdAt >= new Date(filterBy.createdAt);
            }
            return isMatch;
        });
    }

    getTaskById(id: string) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) {
            throw new CustomError('Task not found', 404);
        }
        return task;
    }

    createTask(task: ITask) {
        if (new Date(task.deadline) < new Date()) {
            throw new CustomError('Deadline must be in the future', 400);
        }
        
        const newTask = {
            ...task,
            id: uuidv4(),
            createdAt: new Date(),
        };
        this.tasks.push(newTask);
        return newTask;
    }

    deleteTask(id: string) {
        const task = this.getTaskById(id);
        if (!task) {
            throw new CustomError('Task not found', 404);
        }
        this.tasks = this.tasks.filter(task => task.id !== id);
        return task;
    }

    updateTask(id: string, newTask: ITaskUpdate) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) {
            throw new CustomError('Task not found', 404);
        } else {
            if (newTask.deadline && new Date(newTask.deadline) < new Date(task.createdAt)) {
                throw new CustomError('Deadline must be after creation date', 400);
            }
            this.tasks = this.tasks.map(task => task.id === id ? { ...task, ...newTask } : task);
        }
        return this.getTaskById(id);
    }
}