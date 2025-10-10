import { TaskController } from "./modules/tasks/task.controller";
import { TaskService } from "./modules/tasks/task.service";
import { Task, Subtask, Bug, Story, Epic } from "./modules/tasks/task.types";
import { Priority, Status } from "./types";

const tasks: Task[] = [
    new Task('1', 'Task 1', new Date('2021-01-01'), new Date('2021-01-02')),
    new Subtask('2', 'Subtask 1', new Date('2021-02-01'), new Date('2021-02-02')),
    new Bug('3', 'Bug 1', new Date('2021-03-01'), new Date('2021-03-02')),
    new Story('4', 'Story 1', new Date('2021-04-01'), new Date('2021-04-02')),
    new Epic('5', 'Epic 1', new Date('2021-05-01'), new Date('2021-05-02')),
];
const taskService = new TaskService(tasks);
const taskController = new TaskController(taskService);

console.log(taskController.getAllTasksDetails());
console.log('--------------------------------');
console.log('Update task 1');
taskController.updateTask('1', {
    title: 'Task 1 modified',
    status: Status.DONE,
    priority: Priority.HIGH,
    deadline: new Date('2021-01-03'),
});
console.log(taskController.getTaskDetails('1'));
console.log('--------------------------------');
console.log('Delete task 4');
taskController.deleteTask('4');
console.log(taskController.getAllTasksDetails());
console.log('--------------------------------');
console.log('Get tasks by status: DONE');
console.log(taskController.getTasksByStatus(Status.DONE));
console.log('--------------------------------');
console.log('Get tasks by priority: HIGH');
console.log(taskController.getTasksByPriority(Priority.HIGH));
console.log('--------------------------------');
console.log('Get tasks by created at: 2021-03-01');
console.log(taskController.getTasksByCreatedAt(new Date('2021-03-01')));
console.log('--------------------------------');
console.log('Check if task 1 is completed before deadline');
console.log(taskController.isTaskCompletedBeforeDeadline('1'));
console.log('--------------------------------');