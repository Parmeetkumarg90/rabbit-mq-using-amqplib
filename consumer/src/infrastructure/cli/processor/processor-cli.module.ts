import { Module } from '@nestjs/common';
import ProcessorCommand from './processor.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '../../database/database-datasource';
import RabbitMqModule from '../../rabbitmq/rabbitmq.module';
import ProcessorModule from '../../rabbitmq/processor/processor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSource.options,
      retryDelay: 3000,
      retryAttempts: 1000,
    }),
    RabbitMqModule,
    ProcessorModule,
  ],
  providers: [ProcessorCommand],
  exports: [ProcessorCommand],
})
export default class ProcessorCliModule {}
