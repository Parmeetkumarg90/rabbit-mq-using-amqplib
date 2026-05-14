import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import InboxEntity from "src/features/common/entity/inbox.entity";

@Injectable()
export default class InboxRepository extends Repository<InboxEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(InboxEntity, dataSource.createEntityManager());
    }

    async getInboxEventUsingEventIdAndHandlerName(eventId: number, handlerName: string) {
        const inboxEvents = await this.find({ where: { eventId: { id: eventId }, handlerName } });
        return inboxEvents.length > 0 ? inboxEvents[0] : null;
    }

    async addNewInboxEvent(eventId: number, handlerName: string) {
        try {
            const structure = this.create({ eventId: { id: eventId }, handlerName });
            return await this.save(structure);
        }
        catch (e) {
            console.log("Error in creating inbox event: ", e);
            return null;
        }
    }
}