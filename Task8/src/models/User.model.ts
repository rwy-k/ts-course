import { Model, Column, DataType, Table, PrimaryKey, Default, AllowNull, HasMany } from 'sequelize-typescript';
import Task from './Task.model.js';

@Table({
    tableName: 'users'
})
export class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string; 

    @AllowNull(false)
    @Column(DataType.STRING)
    declare name: string;

    @HasMany(() => Task, { foreignKey: 'userId', onDelete: 'CASCADE' })
    declare tasks: Task[];
}

export default User;