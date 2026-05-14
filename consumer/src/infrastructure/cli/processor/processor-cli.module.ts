import { Module } from "@nestjs/common";
import ProcessorCommand from "./processor.command";
import ProcessorModule from "src/infrastructure/rabbitmq/processor/processor.module";
import dataSource from "src/infrastructure/database/database-datasource";
import { TypeOrmModule } from "@nestjs/typeorm";
import RabbitMqModule from "src/infrastructure/rabbitmq/rabbitmq.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...dataSource.options,
            retryDelay: 3000,
            retryAttempts: 1000
        }), RabbitMqModule, 
        ProcessorModule],
    providers: [ProcessorCommand],
    exports: [ProcessorCommand]
})
export default class ProcessorCliModule { };