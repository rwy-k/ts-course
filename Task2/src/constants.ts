import { Priority, Status } from "./dto/Task";
export const DEFAULT_PRIORITY = Priority.LOW as const;
export const DEFAULT_STATUS = Status.TODO as const;
export const DEFAULT_DESCRIPTION = '' as const;