export interface ITask {
    id: string;
    title: string;
    description?: string;
    createdAt: Date;
    deadline: Date;
    status: Status;
    priority: Priority;
    type: TaskType;
    userId: string;
}

export interface ITaskUpdate extends Partial<ITask> {
    deadline: Date;
    status: Status;
    priority: Priority;
    type: TaskType;
    title: string;
    userId: string;
}

export interface ITaskFilter {
    status?: Status;
    priority?: Priority;
    createdAt?: string;
}

export enum Status {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    IN_REVIEW = 'in_review',
    DONE = 'done',
}

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum TaskType {
    TASK = 'task',
    STORY = 'story',
    EPIC = 'epic',
    BUG = 'bug',
    FEATURE = 'feature',
}
