import { Injectable } from "@nestjs/common";
import OutboxEntity from "src/features/common/entity/outbox-entity";
import { DataSource, Repository } from "typeorm";

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
            order: { createdAt: "ASC" },
            take: 10
        });
    }

    async changeOutboxStatusUsingEventId(eventId: number, status: boolean) {
        const response = await this.update({ id: eventId }, { status });
        return !!(response.affected);
    }
}