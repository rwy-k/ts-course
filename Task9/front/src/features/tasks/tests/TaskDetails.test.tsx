import { describe, it, expect } from 'vitest';
import { TaskDetailsPage } from '../pages/TaskDetailsPage';
import { TaskService } from '../api';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Status, Priority } from '../enums';
import userEvent from '@testing-library/user-event';

const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    createdAt: new Date(),
    deadline: new Date('2099-12-31'),
    status: Status.TODO,
    priority: Priority.HIGH,
};
const TaskDetailsPageMemoryRouter = (mockTaskService: Partial<TaskService>) => {
    return (
        <MemoryRouter initialEntries={['/tasks/1']}>
            <Routes>
                <Route path="/tasks/:id" element={<TaskDetailsPage taskService={mockTaskService as TaskService} />} />
            </Routes>
        </MemoryRouter>
    );
};
describe('TaskDetailsPage', () => {
    it('should render the task details page', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
        };
        render(<TaskDetailsPageMemoryRouter mockTaskService={mockTaskService} />);
        expect(await screen.findByRole('heading', { name: /task details/i })).toBeInTheDocument();
    });
    it('should render the back button', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
        };
        render(<TaskDetailsPageMemoryRouter mockTaskService={mockTaskService} />);
        expect(screen.getByText('Back')).toBeInTheDocument();
    });
    it('should render the delete button', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
        };
        render(<TaskDetailsPageMemoryRouter mockTaskService={mockTaskService} />);
        expect(await screen.findByText('Delete')).toBeInTheDocument();
    });
    it('should render the update button', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
        };
        render(<TaskDetailsPageMemoryRouter mockTaskService={mockTaskService} />);
        expect(await screen.findByText('Update')).toBeInTheDocument();
    });
    it('should show the toast when got an error deleting a task', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
            deleteTaskById: vi.fn().mockRejectedValue(new Error('Failed to delete task')),
        };
        render(
            <MemoryRouter initialEntries={['/tasks/1']}>
                <Routes>
                    <Route
                        path="/tasks/:id"
                        element={<TaskDetailsPage taskService={mockTaskService as TaskService} />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => screen.getByText('Delete'));
        await user.click(screen.getByText('Delete'));

        expect(await screen.findByText('Failed to delete task')).toBeInTheDocument();
    });
    it('should show the toast when the task is deleted successfully', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
            deleteTaskById: vi.fn().mockResolvedValue(undefined),
        };
        render(<TaskDetailsPageMemoryRouter mockTaskService={mockTaskService} />);

        await waitFor(() => screen.getByText('Delete'));
        await user.click(screen.getByText('Delete'));

        expect(await screen.findByText('Task deleted successfully')).toBeInTheDocument();
    });
    it('should render the task details', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
        };
        render(<TaskDetailsPageMemoryRouter mockTaskService={mockTaskService} />);

        expect(await screen.findByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
    it('should show an empty state when the task is not found', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockRejectedValue(new Error('Task not found')),
        };
        render(<TaskDetailsPageMemoryRouter mockTaskService={mockTaskService} />);
        expect(screen.getByText('Task not found')).toBeInTheDocument();
    });
});
