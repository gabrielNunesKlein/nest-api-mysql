import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Migrate1700251106035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '63'
                },

                {
                    name: 'email',
                    type: 'varchar',
                    length: '127'
                },

                {
                    name: 'password',
                    type: 'varchar',
                    length: '127'
                },

                {
                    name: 'role',
                    type: 'int',
                    default: '1'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
