import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import Task from '../models/Task.model.js';
import User from '../models/User.model.js';

interface DBConfig {
    development: {
        dialect: Dialect;
        host: string;
        port: number;
        username: string;
        database: string;
        password: string;
    };
    test: {
        dialect: Dialect;
        storage: string;
        logging: boolean;
    };
}

const config: DBConfig = {
    development: {
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USER || '',
        database: process.env.DB_NAME || '',
        password: process.env.DB_PASSWORD || '',
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    },
};

const nodeEnv =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? process.env.NODE_ENV : 'development';

const sequelize = new Sequelize({
    ...config[nodeEnv],
});

sequelize.addModels([Task, User]);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

sequelize
    .sync()
    .then(() => {
        console.log('Database and tables created!');
    })
    .catch((err) => {
        console.error('Unable to create table:', err);
    });

export default sequelize;
