import { Injectable } from "@nestjs/common";
import EventCreationDto from "src/features/common/dto/event-dto";
import OutboxEntity from "src/features/common/entity/outbox-entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export default class OutboxRepository extends Repository<OutboxEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(OutboxEntity, dataSource.createEntityManager());
    }

    async createEvent(eventPayload: EventCreationDto) {
        const event = this.create({
            event: eventPayload
        });
        return await this.save(event);
    }
}