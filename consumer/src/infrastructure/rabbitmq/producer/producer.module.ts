import { Module } from '@nestjs/common';
import ProducerService from './producer.service';
import OutboxRepository from '../../database/repository/outbox.repository';

@Module({
  providers: [ProducerService, OutboxRepository],
  exports: [ProducerService],
})
export default class ProducerModule {}
