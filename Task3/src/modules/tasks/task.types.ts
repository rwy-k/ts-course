import { ITask, Status, Priority, TaskType } from "../../types";
import { DEFAULT_STATUS, DEFAULT_PRIORITY } from "../../constants";

const validateTask = (id: string, title: string, createdAt: Date, deadline: Date, status?: Status, priority?: Priority, type: TaskType = TaskType.TASK) => {
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

export class Task implements ITask {
    constructor(public id: string, public title: string, public createdAt: Date, public deadline: Date, public status: Status = DEFAULT_STATUS, public priority: Priority = DEFAULT_PRIORITY, readonly type: TaskType = TaskType.TASK) {
        validateTask(id, title, createdAt, deadline, status, priority, type);

        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.deadline = deadline;
        this.status = status;
        this.priority = priority;
        this.type = type;
    }

    getTaskInfo() {
        return `Task ${this.id}: ${this.title}\nCreated at: ${this.createdAt}\nDeadline: ${this.deadline}\nStatus: ${this.status}\nPriority: ${this.priority}\n`;
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

export class Subtask extends Task {
    constructor(id: string, title: string, createdAt: Date, deadline: Date, status: Status = DEFAULT_STATUS, priority: Priority = DEFAULT_PRIORITY) {
        super(id, title, createdAt, deadline, status, priority, TaskType.SUBTASK);
    }

    getTaskInfo() {
        return `Subtask ${this.id}: ${this.title}\nCreated at: ${this.createdAt}\nDeadline: ${this.deadline}\nStatus: ${this.status}\nPriority: ${this.priority}\n`;
    }
}

export class Bug extends Task {
    constructor(id: string, title: string, createdAt: Date, deadline: Date, status: Status = DEFAULT_STATUS, priority: Priority = DEFAULT_PRIORITY) {
        super(id, title, createdAt, deadline, status, priority, TaskType.BUG);
    }

    getTaskInfo() {
        return `Bug ${this.id}: ${this.title}\nCreated at: ${this.createdAt}\nDeadline: ${this.deadline}\nStatus: ${this.status}\nPriority: ${this.priority}\n`;
    }
}

export class Story extends Task {
    constructor(id: string, title: string, createdAt: Date, deadline: Date, status: Status = DEFAULT_STATUS, priority: Priority = DEFAULT_PRIORITY) {
        super(id, title, createdAt, deadline, status, priority, TaskType.STORY);
    }
    
    getTaskInfo() {
        return `Story ${this.id}: ${this.title}\nCreated at: ${this.createdAt}\nDeadline: ${this.deadline}\nStatus: ${this.status}\nPriority: ${this.priority}\n`;
    }
}

export class Epic extends Task {
    constructor(id: string, title: string, createdAt: Date, deadline: Date, status: Status = DEFAULT_STATUS, priority: Priority = DEFAULT_PRIORITY) {
        super(id, title, createdAt, deadline, status, priority, TaskType.EPIC);
    }
    
    getTaskInfo() {
        return `Epic ${this.id}: ${this.title}\nCreated at: ${this.createdAt}\nDeadline: ${this.deadline}\nStatus: ${this.status}\nPriority: ${this.priority}\n`;
    }
}