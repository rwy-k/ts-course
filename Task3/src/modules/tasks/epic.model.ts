import { Task } from "./task.model";
import { Status, Priority, TaskType, IEpic, ISubtask } from "./task.types";
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from "../../constants";

export class Epic extends Task implements IEpic {
    subtasks: ISubtask[];
    constructor(id: string, title: string, createdAt: Date, deadline: Date, status: Status = DEFAULT_STATUS, priority: Priority = DEFAULT_PRIORITY, subtasks: ISubtask[]) {
        super(id, title, createdAt, deadline, status, priority, TaskType.EPIC);
        this.subtasks = subtasks;
    }
    
    getTaskInfo() {
        return `Epic ${this.id}: ${this.title}\nTask type: ${this.type}\nSubtasks: ${this.subtasks.map(subtask => subtask.id).join(', ')}\nCreated at: ${this.createdAt}\nDeadline: ${this.deadline}\nStatus: ${this.status}\nPriority: ${this.priority}\n`;
    }
}