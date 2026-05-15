import { Module } from '@nestjs/common';
import ProducerCommand from './producer.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '../../database/database-datasource';
import RabbitMqModule from '../../rabbitmq/rabbitmq.module';
import ProducerModule from '../../rabbitmq/producer/producer.module';
import OutboxRepository from '../../database/repository/outbox.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSource.options,
      retryDelay: 3000,
      retryAttempts: 1000,
    }),
    RabbitMqModule,
    ProducerModule,
  ],
  providers: [OutboxRepository, ProducerCommand],
  exports: [ProducerCommand],
})
export default class ProducerCliModule {}
