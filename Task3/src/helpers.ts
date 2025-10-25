import { Status, Priority, TaskType } from "./modules/tasks/task.types";
export const validateTask = (id: string, title: string, createdAt: Date, deadline: Date, status?: Status, priority?: Priority, type: TaskType = TaskType.TASK) => {
    if (!id || !title || !createdAt || !deadline) {
        throw new Error('Id, title, createdAt and deadline are required');
    }
    if (typeof id === 'number' && id < 0) {
        throw new Error('Id must be a positive number');
    }
    if (!Object.values(TaskType).includes(type)) {
        throw new Error(`Invalid task type: ${type}`);
    }
    if (!Object.values(Status).includes(status)) {
        throw new Error(`Invalid status: ${status}`);
    }
    if (!Object.values(Priority).includes(priority)) {
        throw new Error(`Invalid priority: ${priority}`);
    }
    if (createdAt >= deadline) {
        throw new Error(`Created at must be before the deadline: ${createdAt} >= ${deadline}`);
    }
}
