import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqplib from "amqplib";

@Injectable()
export default class RabbitMqService implements OnModuleInit, OnModuleDestroy {
    private connection!: amqplib.ChannelModel;
    private channel!: amqplib.Channel | null;
    private readonly eventDeadLetterExchange = process.env?.EVENT_DEAD_LETTER_EXCHANGE_NAME ?? "event_dead_letter_exchange";
    private readonly eventDeadLetterQueue = process.env?.EVENT_DEAD_LETTER_QUEUE_NAME ?? "event_dead_letter_queue";
    private readonly eventQueue = process.env?.EVENT_QUEUE_NAME ?? "event_queue";
    private readonly eventExchange = process.env?.EVENT_EXCHANGE_NAME ?? "event_exchange";

    async onModuleInit() {
        await this.handleAmqpLibStart();
    }

    async onModuleDestroy() {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }

    async handleAmqpLibStart() {
        try {
            this.connection = await amqplib.connect(process.env?.RABBITMQ_URL ?? "amqp://localhost:5672");

            this.connection.on('close', (error) => {
                console.log("Rabbitmq server has been closed. Try to reconnect in 5 seconds: ", error);
                this.restartConnection();
            });

            this.connection.on('error', (error) => {
                console.log("Error in connecting rabbitmq server. Try to reconnect in 5 seconds: ", error);
                this.restartConnection();
            });

            await this.createChannel();
        }
        catch (e) {
            console.log("Error in connecting rabbitmq server. Try to reconnect in 5 seconds: ", e);
            this.restartConnection();
        }
    }

    emitReconnectionEvent() {
        if (this.channel) {
            this.channel.emit("reconnect");
        }
        this.channel = null;
    }

    restartConnection() {
        setTimeout(async () => {
            try {
                await this.handleAmqpLibStart();
            }
            catch (e) { }
        }, 3000);
    }

    reCreateChannel() {
        setTimeout(async () => {
            try {
                if (this.connection) {
                    await this.createChannel();
                }
                else {
                    await this.handleAmqpLibStart();
                }
            }
            catch (e) { }
        }, 3000);
    }

    async createChannel() {
        try {
            this.emitReconnectionEvent();
            // Channel
            this.channel = await this.connection.createChannel();

            this.channel.on('close', (error) => {
                console.log("Channel has been closed. Try to recreate in 5 seconds: ", error);
                this.reCreateChannel();
            });

            this.channel.on('error', (error) => {
                console.log("Error in creating channel. Try to recreate in 5 seconds: ", error);
                this.reCreateChannel();
            });

            // create dead letter queue
            await this.channel.assertExchange(this.eventDeadLetterExchange, "direct", { durable: true });
            await this.channel.assertQueue(this.eventDeadLetterQueue, { durable: true });
            await this.channel.bindQueue(this.eventDeadLetterQueue, this.eventDeadLetterExchange, 'to-dead-letter-queue');

            // assert main queue and dead letter queue to channel
            await this.channel.assertExchange(this.eventExchange, "direct", { durable: true });
            await this.channel.assertQueue(this.eventQueue, {
                durable: true,
                arguments: {
                    'x-dead-letter-exchange': this.eventDeadLetterExchange,
                    'x-dead-letter-routing-key': 'to-dead-letter-queue',
                }
            });
            await this.channel.bindQueue(this.eventQueue, this.eventExchange, 'to-event-queue');
        }
        catch (e) {
            console.log("Error in creating channel: ", e);
            this.reCreateChannel();
        }
    }

    getChannel() {
        if (!this.channel) {
            console.log("Rabbitmq channel has not been created yet");
            this.reCreateChannel();
            return null;
        }
        return this.channel;
    }
}