import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import OutboxEntity from '../../../features/common/entity/outbox-entity';
import EventCreationDto from '../../../features/common/dto/event-dto';

@Injectable()
export default class OutboxRepository extends Repository<OutboxEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(OutboxEntity, dataSource.createEntityManager());
  }

  async createEvent(eventPayload: EventCreationDto) {
    const event = this.create({
      event: eventPayload,
    });
    return await this.save(event);
  }
}
