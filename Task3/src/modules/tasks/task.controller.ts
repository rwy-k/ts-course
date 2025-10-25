import { TaskService } from "./task.service";
import { Priority, Status, ITask } from "./task.types";
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    getTaskDetails(id: string) {
        return this.taskService.getTaskDetails(id);
    }

    getAllTasksDetails() {
        return this.taskService.getAllTasksDetails().join('\n');
    }

    addTask(task: ITask) {
        return this.taskService.addTask(task);
    }

    updateTask(id: string, task: Partial<ITask>) {
        return this.taskService.updateTask(id, task);
    }

    deleteTask(id: string) {
        return this.taskService.deleteTask(id);
    }

    getTasksByStatus(status: Status) {
        return this.taskService.getTasksByStatus(status).map(task => task.getTaskInfo()).join('\n');
    }

    getTasksByPriority(priority: Priority) {
        return this.taskService.getTasksByPriority(priority).map(task => task.getTaskInfo()).join('\n');
    }

    getTasksByCreatedAt(createdAt: Date) {
        return this.taskService.getTasksByCreatedAt(createdAt).map(task => task.getTaskInfo()).join('\n');
    }

    isTaskCompletedBeforeDeadline(id: string) {
        return this.taskService.isTaskCompletedBeforeDeadline(id) ? 'Task is completed before the deadline' : 'Task is not completed before the deadline';
    }
}