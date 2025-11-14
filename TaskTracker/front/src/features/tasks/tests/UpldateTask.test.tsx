import { describe, it, expect } from 'vitest';
import { UpdateTaskPage } from '../pages/UpdateTaskPage';
import { TaskService } from '../api';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { Status, Priority } from '../enums';

const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    createdAt: new Date(),
    deadline: new Date('2099-12-31'),
    status: Status.TODO,
    priority: Priority.HIGH,
};

describe('UpdateTaskPage', () => {
    it('should render the update task page', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
        };
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route
                        path="/tasks/:id/edit"
                        element={<UpdateTaskPage taskService={mockTaskService as TaskService} />}
                    />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByRole('heading', { name: /update task/i })).toBeInTheDocument();
    });
    it('should render the back button', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
        };
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route
                        path="/tasks/:id/edit"
                        element={<UpdateTaskPage taskService={mockTaskService as TaskService} />}
                    />
                </Routes>
            </MemoryRouter>,
        );
        expect(screen.getByText('Back')).toBeInTheDocument();
    });
    it('submit button should be disabled if the form is invalid', async () => {
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
        };
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route
                        path="/tasks/:id/edit"
                        element={<UpdateTaskPage taskService={mockTaskService as TaskService} />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            const button = screen.getByRole('button', { name: /update task/i });
            expect(button).toBeDisabled();
        });
    });
    it('submit button should be enabled if the form is valid', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
            updateTask: vi.fn().mockResolvedValue(mockTask),
        };
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route
                        path="/tasks/:id/edit"
                        element={<UpdateTaskPage taskService={mockTaskService as TaskService} />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => screen.getByPlaceholderText('Title'));

        await user.clear(screen.getByPlaceholderText('Title'));
        await user.type(screen.getByPlaceholderText('Title'), 'Updated Task');

        const button = screen.getByRole('button', { name: /update task/i });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
    });
    it('should show the toast when got an error updating a task', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
            updateTask: vi.fn().mockRejectedValue(new Error('Failed to update task')),
        };
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route
                        path="/tasks/:id/edit"
                        element={<UpdateTaskPage taskService={mockTaskService as TaskService} />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => screen.getByPlaceholderText('Title'));

        await user.clear(screen.getByPlaceholderText('Title'));
        await user.type(screen.getByPlaceholderText('Title'), 'Updated Task');
        await user.click(screen.getByRole('button', { name: /update task/i }));

        expect(await screen.findByText('Failed to update task')).toBeInTheDocument();
    });
    it('should show the toast when the task is updated successfully', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            getTaskById: vi.fn().mockResolvedValue(mockTask),
            updateTask: vi.fn().mockResolvedValue(mockTask),
        };
        render(
            <MemoryRouter initialEntries={['/tasks/1/edit']}>
                <Routes>
                    <Route
                        path="/tasks/:id/edit"
                        element={<UpdateTaskPage taskService={mockTaskService as TaskService} />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => screen.getByPlaceholderText('Title'));

        await user.clear(screen.getByPlaceholderText('Title'));
        await user.type(screen.getByPlaceholderText('Title'), 'Updated Task');
        await user.click(screen.getByRole('button', { name: /update task/i }));

        expect(await screen.findByText('Task updated successfully')).toBeInTheDocument();
    });
});
