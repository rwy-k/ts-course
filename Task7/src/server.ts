import express from 'express';
import taskRouter from './routes/task.router.js';
import { errorHandler } from './middleware/errorHandler.js';
import morgan from 'morgan';
import cors from 'cors';

const logger = morgan('dev');
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

app.use('/tasks', taskRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});