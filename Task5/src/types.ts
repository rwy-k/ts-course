export type Task = {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    deadline: Date;
    status: Status;
    priority: Priority;
};
export enum Status {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}
export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export enum ToastType {
    SUCCESS = 'success',
    ERROR = 'error'
}
