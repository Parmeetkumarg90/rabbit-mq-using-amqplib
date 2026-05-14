import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Inbox1764572518133 implements MigrationInterface {
    name = 'Inbox1764572518133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "inbox",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "eventIdId", type: "int" },
                { name: "handlerName", type: "varchar", default: "''" },
                { name: "createdAt", type: "timestamp", default: "now()" },
                { name: "updateAt", type: "timestamp", default: "now()" },
                { name: "deletedAt", type: "timestamp", isNullable: true }
            ]
        }), true);

        await queryRunner.createForeignKey("inbox",
            new TableForeignKey({
                columnNames: ['eventIdId'],
                referencedColumnNames: ['id'],
                referencedTableName: "outbox",
                onDelete: "CASCADE",
                name: "INBOX_OUTBOX_FOREIGN_KEY"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("inbox", "INBOX_OUTBOX_FOREIGN_KEY");
        await queryRunner.dropTable("inbox");
    }
}