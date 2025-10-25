import { Task } from "./task.model";
import { Status, Priority, TaskType, Severity, IBug } from "./task.types";
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from "../../constants";

export class Bug extends Task implements IBug {
    severity: Severity;
    constructor(id: string, title: string, createdAt: Date, deadline: Date, status: Status = DEFAULT_STATUS, priority: Priority = DEFAULT_PRIORITY, severity: Severity = Severity.LOW) {
        super(id, title, createdAt, deadline, status, priority, TaskType.BUG);
        this.severity = severity;
    }

    getTaskInfo() {
        return `Bug ${this.id}: ${this.title}\nTask type: ${this.type}\nSeverity: ${this.severity}\nCreated at: ${this.createdAt}\nDeadline: ${this.deadline}\nStatus: ${this.status}\nPriority: ${this.priority}\n`;
    }
}