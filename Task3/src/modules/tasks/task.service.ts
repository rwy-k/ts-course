import { Priority, Status, ITask } from "../../types";

export class TaskService {
    constructor(private _tasks: ITask[]) {}

    getTaskDetails(taskId: string) {
        return this._tasks.find(task => task.id === taskId).getTaskInfo();
    }

    getAllTasksDetails() {
        return this._tasks.map(task => task.getTaskInfo());
    }

    addTask(task: ITask): void {
        if (this._tasks.find(task => task.id === task.id)) {
            throw new Error(`Task ${task.id} already exists`);
        }
        this._tasks.push(task);
    }

    updateTask(taskId: string, task: Partial<ITask>): void {
        const taskIndex = this._tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this._tasks[taskIndex].updateTask(task);
        } else {
            throw new Error(`Task ${taskId} not found`);
        }
    }

    deleteTask(taskId: string): void {
        const taskIndex = this._tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this._tasks.splice(taskIndex, 1);
        } else {
            throw new Error(`Task ${taskId} not found`);
        }
    }

    getTasksByStatus(status: Status): ITask[] {
        return this._tasks.filter(task => task.status === status);
    }
    
    getTasksByPriority(priority: Priority): ITask[] {
        return this._tasks.filter(task => task.priority === priority);
    }
    
    getTasksByCreatedAt(createdAt: Date): ITask[] {
        return this._tasks.filter(task => {
            if (typeof task.createdAt === 'string') {
                return task.createdAt === createdAt.toISOString();
            }
            return task.createdAt.toISOString() === createdAt.toISOString();
        });
    }

    isTaskCompletedBeforeDeadline(taskId: string): boolean {
        const task = this._tasks.find(task => task.id === taskId);
        if (task) {
            if (typeof task.deadline === 'string') {
                return task.deadline === new Date().toISOString() && task.status === Status.DONE;
            }       
            return task.deadline.toISOString() < new Date().toISOString() && task.status === Status.DONE;
        }
        throw new Error(`Task ${taskId} not found`);
    }
}