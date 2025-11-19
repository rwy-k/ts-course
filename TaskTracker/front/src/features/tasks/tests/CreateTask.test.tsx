import { describe, it, expect, vi } from 'vitest';
import { CreateTaskPage } from '../pages/CreateTaskPage';
import { TaskService } from '@/api/task.controller';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('CreateTaskPage', () => {
    it('should render the create task page', async () => {
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        };
        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>,
        );
        expect(await screen.findByRole('heading', { name: /create task/i })).toBeInTheDocument();
    });
    it('should render the back button', async () => {
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        };
        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>,
        );
        expect(await screen.findByText('Back')).toBeInTheDocument();
    });
    it('submit button should be disabled if the form is invalid', async () => {
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        };
        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>,
        );
        const button = await screen.findByRole('button', { name: /create task/i });
        expect(button).toBeDisabled();
    });
    it('submit button should be enabled if the form is valid', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        };

        // Mock fetch to return users
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [{ id: 'user-1', name: 'Test User' }],
        } as Response);

        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>,
        );

        await user.type(await screen.findByPlaceholderText('Title'), 'Test Task');
        await user.tab();
        await user.type(screen.getByLabelText(/deadline/i), '2099-12-31');
        await user.tab();

        const button = screen.getByRole('button', { name: /create task/i });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
    });
    it('should show the toast when got an error creating a task', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockRejectedValue(new Error('Failed to create task')),
        };

        // Mock fetch to return users
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [{ id: 'user-1', name: 'Test User' }],
        } as Response);

        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>,
        );

        await user.type(await screen.findByPlaceholderText('Title'), 'Test Task');
        await user.tab();
        await user.type(screen.getByLabelText(/deadline/i), '2099-12-31');
        await user.tab();
        await user.click(screen.getByRole('button', { name: /create task/i }));

        expect(await screen.findByText('Failed to create task')).toBeInTheDocument();
    });
    it('should show the toast when the task is created successfully', async () => {
        const user = userEvent.setup();
        const mockTaskService: Partial<TaskService> = {
            createTask: vi.fn().mockResolvedValue({}),
        };

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [{ id: 'user-1', name: 'Test User' }],
        } as Response);

        render(
            <MemoryRouter>
                <CreateTaskPage taskService={mockTaskService as TaskService} />
            </MemoryRouter>,
        );

        await user.type(await screen.findByPlaceholderText('Title'), 'Test Task');
        await user.tab();
        await user.type(screen.getByLabelText(/deadline/i), '2099-12-31');
        await user.tab();
        await user.click(screen.getByRole('button', { name: /create task/i }));

        expect(await screen.findByText('Task created successfully')).toBeInTheDocument();
    });
});
