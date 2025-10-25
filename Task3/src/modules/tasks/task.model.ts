import { ITask, Status, Priority, TaskType } from "./task.types";
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from "../../constants";
import { validateTask } from "../../helpers";

export class Task implements ITask {
    constructor(public id: string, public title: string, public createdAt: Date, public deadline: Date, public status: Status = DEFAULT_STATUS, public priority: Priority = DEFAULT_PRIORITY, readonly type: TaskType = TaskType.TASK) {
        validateTask(id, title, createdAt, deadline, status, priority, type);
    }

    getTaskInfo() {
        return `Task ${this.id}: ${this.title}\nTask type: ${this.type}\nCreated at: ${this.createdAt}\nDeadline: ${this.deadline}\nStatus: ${this.status}\nPriority: ${this.priority}\n`;
    }
    updateTask(task: Partial<ITask>) {
        if (task.createdAt) {
            throw new Error('Created at cannot be updated');
        }
        if (task.deadline && task.deadline < this.createdAt) {
            throw new Error(`Deadline ${task.deadline} cannot be before created at ${this.createdAt}`);
        }
        if (task.status && !Object.values(Status).includes(task.status)) {
            throw new Error('Invalid status');
        }
        if (task.priority && !Object.values(Priority).includes(task.priority)) {
            throw new Error('Invalid priority');
        }
        this.title = task.title || this.title;
        this.deadline = task.deadline || this.deadline;
        this.status = task.status || this.status;
        this.priority = task.priority || this.priority;
    }

}
