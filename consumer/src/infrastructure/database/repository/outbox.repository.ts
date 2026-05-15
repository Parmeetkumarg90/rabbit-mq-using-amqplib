import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import OutboxEntity from '../../../features/common/entity/outbox-entity';

@Injectable()
export default class OutboxRepository extends Repository<OutboxEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(OutboxEntity, dataSource.createEntityManager());
  }

  async findFirstTenEvent() {
    return await this.find({
      where: {
        status: false,
      },
      order: { createdAt: 'ASC' },
      take: 10,
    });
  }

  async changeOutboxStatusUsingEventId(eventId: number, status: boolean) {
    const response = await this.update({ id: eventId }, { status });
    return !!response.affected;
  }
}
