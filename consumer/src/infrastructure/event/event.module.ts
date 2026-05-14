import { Module } from "@nestjs/common";
import EventService from "./event.service";
import { ScheduleModule } from "@nestjs/schedule";
import ProducerCliModule from "../cli/producer/producer-cli.module";
import ProcessorCliModule from "../cli/processor/processor-cli.module";

@Module({
    imports: [ScheduleModule.forRoot(), ProducerCliModule, ProcessorCliModule],
    providers: [EventService]
})
export default class EventModule { };