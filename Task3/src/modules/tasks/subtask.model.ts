import { Task } from "./task.model";
import { Status, Priority, TaskType, ISubtask } from "./task.types";
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from "../../constants";

export class Subtask extends Task implements ISubtask {
    parentTaskId: string;
    constructor(id: string, title: string, createdAt: Date, deadline: Date, status: Status = DEFAULT_STATUS, priority: Priority = DEFAULT_PRIORITY, parentTaskId: string) {
        super(id, title, createdAt, deadline, status, priority, TaskType.SUBTASK);
        this.parentTaskId = parentTaskId;
    }

    getTaskInfo() {
        return `Subtask ${this.id}: ${this.title}\nTask type: ${this.type}\nParent task id: ${this.parentTaskId}\nCreated at: ${this.createdAt}\nDeadline: ${this.deadline}\nStatus: ${this.status}\nPriority: ${this.priority}\n`;
    }
}