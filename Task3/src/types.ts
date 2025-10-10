export type ITask = {
    id: string | number;
    title: string;
    description?: string;
    createdAt: Date;
    status?: Status;
    priority?: Priority;
    deadline: Date;
    type: TaskType;
    getTaskInfo(): string;
    updateTask(task: Partial<ITask>): void;
};

export enum Status {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
}

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum TaskType {
    TASK = 'task',
    SUBTASK = 'subtask',
    BUG = 'bug',
    STORY = 'story',
    EPIC = 'epic'
}