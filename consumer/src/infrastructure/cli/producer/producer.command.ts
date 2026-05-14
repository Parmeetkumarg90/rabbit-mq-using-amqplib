import { Command, CommandRunner } from "nest-commander";
import OutboxRepository from "src/infrastructure/database/repository/outbox.repository";
import ProducerService from "src/infrastructure/rabbitmq/producer/producer.service";

@Command({ name: "dispatch:events", description:"Publisher the messages to exchange and then to queue" })
export default class ProducerCommand extends CommandRunner {
    constructor(private readonly outboxRepo: OutboxRepository, private readonly producerService: ProducerService) {
        super();
    }

    async run(): Promise<void> {
        const events = await this.outboxRepo.findFirstTenEvent();
        if (events && events.length > 0) {
            for (let event of events) {
                this.producerService.handleSendToQueue({
                    event: event.event,
                    eventId: event.id,
                });
            }
        }
    }
}