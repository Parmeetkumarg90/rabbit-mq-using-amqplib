import { Module } from '@nestjs/common';
import ProcessorService from './processor.service';
import InboxRepository from '../../database/repository/inbox.repository';

@Module({
  providers: [ProcessorService, InboxRepository],
  exports: [ProcessorService],
})
export default class ProcessorModule {}
