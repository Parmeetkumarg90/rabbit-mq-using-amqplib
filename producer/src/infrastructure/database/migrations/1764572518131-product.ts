import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Product1764572518131 implements MigrationInterface {
    name = 'Product1764572518131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "products",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "product_name", type: "varchar", isNullable: false },
                { name: "isEventCreated", type: "bool", default: "false" },
                { name: "createdAt", type: "timestamp", default: "now()" },
                { name: "updateAt", type: "timestamp", default: "now()" },
                { name: "deletedAt", type: "timestamp", isNullable: true }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products");
    }
}