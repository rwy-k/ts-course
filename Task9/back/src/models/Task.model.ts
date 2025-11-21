import { Model, Column, DataType, Table, PrimaryKey, Default, AllowNull, ForeignKey } from 'sequelize-typescript';
import { Status, Priority, TaskType } from '../types/task.types.js';
import User from './User.model.js';

@Table({
    tableName: 'tasks',
})
export class Task extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare title: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    declare description?: string;

    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(Status)))
    declare status: Status;

    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(Priority)))
    declare priority: Priority;

    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(TaskType)))
    declare type: TaskType;

    @AllowNull(false)
    @Column(DataType.DATE)
    declare deadline: Date;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    declare userId: string;
}

export default Task;
