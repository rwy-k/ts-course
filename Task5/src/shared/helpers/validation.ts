import { z } from "zod";
import { Status, Priority } from "@/types";

export const taskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional().transform(str => str || ''),
  deadline: z.string().refine(date => validateDeadline(date), {
    message: "Deadline must be in the future",
  }),
  status: z.enum([Status.TODO, Status.IN_PROGRESS, Status.DONE]),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
});

export const validateDeadline = (deadline: Date | string): boolean => {
    if (typeof deadline === 'string') {
        deadline = new Date(deadline);
    }
    return deadline > new Date();
}