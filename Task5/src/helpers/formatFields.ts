import { Priority, Status } from "../types";

export const formatTime = (time: Date | string) => {
    if (typeof time === 'string') {
        time = new Date(time);
    }
    return time.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export const formatDateForInput = (date: Date | string) => {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toISOString().split('T')[0];
};



export const formatStatus = (status: Status) => {
    switch (status) {
        case Status.TODO:
            return 'Todo';
        case Status.IN_PROGRESS:
            return 'In Progress';
        case Status.DONE:
            return 'Done';
    }
}

export const formatPriority = (priority: Priority) => {
    switch (priority) {
        case Priority.LOW:
            return 'Low';
        case Priority.MEDIUM:
            return 'Medium';
        case Priority.HIGH:
            return 'High';
    }
}