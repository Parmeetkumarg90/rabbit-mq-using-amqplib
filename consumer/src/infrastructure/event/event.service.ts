import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import ProducerCommand from "../cli/producer/producer.command";
import ProcessorCommand from "../cli/processor/processor.command";

@Injectable()
export default class EventService {
    private isProcessorRunning: boolean = false;
    constructor(private readonly producerCliService: ProducerCommand, private readonly processorCliService: ProcessorCommand) { }

    @Cron(CronExpression.EVERY_SECOND)
    async createEvent() {
        try {
            // call producer every second
            await this.producerCliService.run();
            // call consumer once
            if (!this.isProcessorRunning) {
                await this.processorCliService.run();
                this.isProcessorRunning = true;
            }
        }
        catch (e) {
            console.log("Error in cli: ", e);
        }
    }
}