import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import EventModule from './infrastructure/event/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './infrastructure/database/database-datasource';
import RabbitMqModule from './infrastructure/rabbitmq/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    ...dataSource.options,
    retryDelay: 3000,
    retryAttempts: 1000
  }), RabbitMqModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }