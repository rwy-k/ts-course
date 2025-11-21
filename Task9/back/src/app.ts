import express from 'express';
import taskRouter from './routes/task.router.js';
import userRouter from './routes/user.router.js';
import { errorHandler } from './middleware/errorHandler.js';
import sequelize from './config/database.js';
import morgan from 'morgan';
import cors from 'cors';

const logger = morgan('dev');
const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

app.use('/tasks', taskRouter);
app.use('/users', userRouter);
app.use(errorHandler);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

export default app;
