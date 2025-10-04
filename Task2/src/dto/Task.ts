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

export type Task = {
    id: string | number;
    title: string;
    description?: string;
    createdAt: string | Date;
    status?: Status;
    priority?: Priority;
    deadline: string | Date;
};