import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Outbox1764572518132 implements MigrationInterface {
    name = 'Outbox1764572518132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "outbox",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "event", type: "jsonb" },
                { name: "status", type: "bool", default: false },
                { name: "createdAt", type: "timestamp", default: "now()" },
                { name: "updateAt", type: "timestamp", default: "now()" },
                { name: "deletedAt", type: "timestamp", isNullable: true }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("outbox");
    }
}