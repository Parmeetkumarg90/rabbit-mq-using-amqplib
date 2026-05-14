import { Module } from "@nestjs/common";
import ProducerCommand from "./producer.command";
import OutboxRepository from "src/infrastructure/database/repository/outbox.repository";
import ProducerModule from "src/infrastructure/rabbitmq/producer/producer.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import dataSource from "src/infrastructure/database/database-datasource";
import RabbitMqModule from "src/infrastructure/rabbitmq/rabbitmq.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...dataSource.options,
            retryDelay: 3000,
            retryAttempts: 1000
        }), RabbitMqModule,
        ProducerModule],
    providers: [OutboxRepository, ProducerCommand],
    exports: [ProducerCommand]
})
export default class ProducerCliModule { };