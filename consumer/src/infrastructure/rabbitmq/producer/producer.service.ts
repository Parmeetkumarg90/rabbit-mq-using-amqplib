import { Injectable } from "@nestjs/common";
import OutboxRepository from "src/infrastructure/database/repository/outbox.repository";
import RabbitMqService from "../rabbitmq.service";

@Injectable()
export default class ProducerService {
    private producerChannel;
    private readonly eventExchange = process.env?.EVENT_EXCHANGE_NAME ?? "event_exchange";

    constructor(private readonly outboxRepo: OutboxRepository, private readonly rabbitMqService: RabbitMqService) { }

    async handleSendToQueue(payload: { event: any, eventId: number }) {
        try {
            this.producerChannel = this.rabbitMqService.getChannel();
            
            if (!this.producerChannel) {
                console.log("Publisher Channel has not created yet");
                return;
            }
            console.log("Message Sent");
            this.producerChannel.publish(this.eventExchange, 'to-event-queue', Buffer.from(JSON.stringify(payload)), { persistent: true });
            await this.outboxRepo.changeOutboxStatusUsingEventId(payload.eventId, true)
        }
        catch (e) {
            console.log("Error in product publishing: ",e);
        }
    }
}