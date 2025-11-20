import db from '../config/database.js';
import request from 'supertest';
import app from '../app.js';
import { Status, Priority, TaskType } from '../types/task.types.js';
import { v4 as uuidv4 } from 'uuid';

beforeEach(async () => {
    await db.sync({ force: true });
});

afterAll(async () => {
    await db.close();
});

it('POST /tasks create a task', async () => {
    // First create a user
    const userResponse = await request(app).post('/users').send({
        name: 'Test User',
    });
    const userId = userResponse.body.id;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

    const response = await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        deadline: futureDate.toISOString(),
        userId: userId,
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
});

it('GET /tasks/:id get a task by id', async () => {
    const userResponse = await request(app).post('/users').send({
        name: 'Test User',
    });
    const userId = userResponse.body.id;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

    const response = await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        deadline: futureDate.toISOString(),
        userId: userId,
    });
    const taskId = response.body.id;

    const getResponse = await request(app).get(`/tasks/${taskId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('id');
});

it('GET /tasks get all tasks', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
});

it('DELETE /tasks/:id delete a task', async () => {
    const userResponse = await request(app).post('/users').send({
        name: 'Test User',
    });
    const userId = userResponse.body.id;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

    const response = await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        deadline: futureDate.toISOString(),
        userId: userId,
    });
    const taskId = response.body.id;

    const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
    expect(deleteResponse.status).toBe(204);
});

it('PUT /tasks/:id update a task', async () => {
    const userResponse = await request(app).post('/users').send({
        name: 'Test User',
    });
    const userId = userResponse.body.id;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

    const response = await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        deadline: futureDate.toISOString(),
        userId: userId,
    });
    const taskId = response.body.id;

    const updateResponse = await request(app).put(`/tasks/${taskId}`).send({
        title: 'Updated Test Task',
        description: 'Updated Test Description',
        status: Status.IN_PROGRESS,
        priority: Priority.MEDIUM,
        type: TaskType.STORY,
        deadline: futureDate.toISOString(),
        userId: userId,
    });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('id');
});

it('GET /tasks/filter filter tasks by status', async () => {
    const userResponse = await request(app).post('/users').send({
        name: 'Test User',
    });
    const userId = userResponse.body.id;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

    await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        deadline: futureDate.toISOString(),
        userId: userId,
    });

    const filterResponse = await request(app).get(`/tasks?status=${Status.TODO}`);
    expect(filterResponse.status).toBe(200);
    expect(filterResponse.body).toHaveLength(1);
});

it('GET /tasks/filter filter tasks by priority', async () => {
    const userResponse = await request(app).post('/users').send({
        name: 'Test User',
    });
    const userId = userResponse.body.id;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

    await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        deadline: futureDate.toISOString(),
        userId: userId,
    });

    const filterResponse = await request(app).get(`/tasks?priority=${Priority.LOW}`);
    expect(filterResponse.status).toBe(200);
    expect(filterResponse.body).toHaveLength(1);
});

it('GET /tasks/filter filter tasks by createdAt', async () => {
    const userResponse = await request(app).post('/users').send({
        name: 'Test User',
    });
    const userId = userResponse.body.id;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // 1 day ago

    await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        deadline: futureDate.toISOString(),
        userId: userId,
    });

    const filterResponse = await request(app).get(`/tasks?createdAt=${pastDate.toISOString()}`);
    expect(filterResponse.status).toBe(200);
    expect(filterResponse.body).toHaveLength(1);
});

it('POST /tasks create a task with invalid body', async () => {
    const response = await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        deadline: 'invalid date',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('POST /tasks create a task with invalid user id', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const response = await request(app).post('/tasks').send({
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.LOW,
        type: TaskType.TASK,
        deadline: futureDate.toISOString(),
        userId: 'invalid user id',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('GET /tasks/filter filter tasks by invalid status', async () => {
    const response = await request(app).get(`/tasks?status=invalid status`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('GET /tasks/filter filter tasks by invalid priority', async () => {
    const response = await request(app).get(`/tasks?priority=invalid priority`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('GET /tasks/filter filter tasks by invalid createdAt', async () => {
    const response = await request(app).get(`/tasks?createdAt=invalid-createdAt`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('GET /tasks/:id get task by invalid id', async () => {
    const response = await request(app).get(`/tasks/invalid-id`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('DELETE /tasks/:id delete task by invalid id', async () => {
    const response = await request(app).delete(`/tasks/invalid-id`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('DELETE /tasks/:id delete task by non-existent id', async () => {
    // Use a valid UUID format that doesn't exist
    const userId = uuidv4();
    const response = await request(app).delete(`/tasks/${userId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
});

it('PUT /tasks/:id update task by invalid id', async () => {
    const response = await request(app).put(`/tasks/invalid-id`).send({
        title: 'Updated Test Task',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('PUT /tasks/:id update task with invalid body', async () => {
    const response = await request(app).put(`/tasks/1`).send({
        title: 'Updated Test Task',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('PUT /tasks/:id update task by invalid user id', async () => {
    const response = await request(app).put(`/tasks/1`).send({
        title: 'Updated Test Task',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('PUT /tasks/:id update task with invalid deadline', async () => {
    const response = await request(app).put(`/tasks/1`).send({
        title: 'Updated Test Task',
        deadline: 'invalid deadline',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('PUT /tasks/:id update task with invalid status', async () => {
    const response = await request(app).put(`/tasks/1`).send({
        title: 'Updated Test Task',
        status: 'invalid status',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('PUT /tasks/:id update task with invalid priority', async () => {
    const response = await request(app).put(`/tasks/1`).send({
        title: 'Updated Test Task',
        priority: 'invalid priority',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});

it('PUT /tasks/:id update task with invalid type', async () => {
    const response = await request(app).put(`/tasks/1`).send({
        title: 'Updated Test Task',
        type: 'invalid type',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
});
