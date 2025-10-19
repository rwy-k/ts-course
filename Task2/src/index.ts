import tasksJSON from './assets/tasks.json';
import { z } from 'zod';
import { DEFAULT_PRIORITY, DEFAULT_STATUS, DEFAULT_DESCRIPTION } from './constants';
import { Task, Status, Priority } from './dto/Task';

const statusSchema = z.enum([Status.TODO, Status.IN_PROGRESS, Status.DONE]);
const prioritySchema = z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]);

const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional().default(DEFAULT_DESCRIPTION),
    createdAt: z.string().transform(str => new Date(str)),
    status: statusSchema.optional().default(DEFAULT_STATUS),
    priority: prioritySchema.optional().default(DEFAULT_PRIORITY),
    deadline: z.string().transform(str => new Date(str)),
});
const tasksSchema = z.array(taskSchema);

const tasks: Task[] = tasksSchema.parse(tasksJSON);

function printTaskDetails(taskId: string) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        console.log('--------------------------------');
        console.log(`Task ${task.id}: ${task.title}`);
        console.log(`Description: ${task.description}`);
        console.log(`Created at: ${task.createdAt}`);
        console.log(`Status: ${task.status}`);
        console.log(`Priority: ${task.priority}`);
        console.log(`Deadline: ${task.deadline}`);
        console.log('--------------------------------');
    } else {
        console.log(`Task ${taskId} not found`);
    }
}
printTaskDetails('1');

function addTask(task: Task): void {
    const taskToAdd: Task = {
        ...task,
        status: task.status || DEFAULT_STATUS,
        priority: task.priority || DEFAULT_PRIORITY,
        description: task.description || DEFAULT_DESCRIPTION,
    }
    tasks.push(taskToAdd);
}

addTask({
    id: '11',
    title: 'Task 11',
    description: 'Description 11',
    createdAt: new Date(),
    deadline: new Date(),
});
printTaskDetails('11');

function updateTask(taskId: string, task: Partial<Task>): void {
    if (task.id || task.createdAt) {
        throw new Error('Id and createdAt cannot be updated');
    }
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (tasks[taskIndex]) {
        tasks[taskIndex] = {
            id: taskId,
            title: task.title || tasks[taskIndex].title,
            createdAt: tasks[taskIndex].createdAt,
            deadline: task.deadline || tasks[taskIndex].deadline,
            status: task.status || tasks[taskIndex].status,
            priority: task.priority || tasks[taskIndex].priority,
            description: task.description || tasks[taskIndex].description,
        };
    } else {
        console.log(`Task ${taskId} not found`);
    }
}

updateTask('11', {
    title: 'Task 11 modified',
});
printTaskDetails('11');

function deleteTask(taskId: string): void {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
    } else {
        console.log(`Task ${taskId} not found`);
    }
}
deleteTask('11');
printTaskDetails('11');

function getTasksByStatus(status: Status): Task[] {
    return tasks.filter(task => task.status === status);
}
console.log('getTasksByStatus(defaultStatus):', getTasksByStatus(DEFAULT_STATUS));

function getTasksByPriority(priority: Priority): Task[] {
    return tasks.filter(task => task.priority === priority);
}
console.log('getTasksByPriority(defaultPriority):', getTasksByPriority(DEFAULT_PRIORITY));

function getTasksByCreatedAt(createdAt: Date): Task[] {
    return tasks.filter(task => {
        return task.createdAt.toISOString() === createdAt.toISOString();
    });
}
console.log('getTasksByCreatedAt(2025-01-01):', getTasksByCreatedAt(new Date('2025-01-01'))); 

function isTaskCompletedBeforeDeadline(taskId: string): boolean {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        return task.deadline.toISOString() < new Date().toISOString() && task.status === Status.DONE;
    }
    console.log(`Task ${taskId} not found`);
    return false;
}
console.log('isTaskCompletedBeforeDeadline(3):', isTaskCompletedBeforeDeadline('3'));
console.log('isTaskCompletedBeforeDeadline(11):', isTaskCompletedBeforeDeadline('11'));