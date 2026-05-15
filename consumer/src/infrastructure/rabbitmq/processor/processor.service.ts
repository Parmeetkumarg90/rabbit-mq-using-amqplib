import { Injectable } from '@nestjs/common';
import * as amqplib from 'amqplib';
import RabbitMqService from '../rabbitmq.service';
import InboxRepository from '../../database/repository/inbox.repository';

@Injectable()
export default class ProcessorService {
  private consumerChannel!: amqplib.Channel | null;
  private readonly eventQueue = process.env?.EVENT_QUEUE_NAME ?? 'event_queue';
  private readonly eventExchange =
    process.env?.EVENT_EXCHANGE_NAME ?? 'event_exchange';
  private readonly maxRequeueCount = Number(
    process.env?.EVENT_MAX_REQUEUE_COUNT ?? 3,
  );
  private readonly maxRetryCount = Number(
    process.env?.EVENT_MAX_RETRY_COUNT ?? 5,
  );
  private readonly messageHandlerNameMap = {
    handleMail: this.handleMail.bind(this),
    handleNotification: this.handleNotification.bind(this),
  };

  constructor(
    private readonly inboxRepo: InboxRepository,
    private readonly rabbitmqService: RabbitMqService,
  ) {}

  async getRabbitMqServerForProcessor() {
    try {
      this.consumerChannel = this.rabbitmqService.getChannel();
      if (!this.consumerChannel) {
        this.refetchRabbitMqConnection();
      } else {
        this.consumerChannel.on('reconnect', () => {
          console.log('Reconnection event received');
          this.consumerChannel = null;
          setTimeout(async () => {
            await this.getRabbitMqServerForProcessor();
          }, 5000);
        });
        await this.consumeMessages();
      }
    } catch (e) {
      this.refetchRabbitMqConnection();
    }
  }

  refetchRabbitMqConnection() {
    console.log('Channel not found');
    setTimeout(async () => {
      await this.getRabbitMqServerForProcessor();
    }, 5000);
  }

  async consumeMessages() {
    try {
      if (!this.consumerChannel) {
        console.log('Channel has not created yet');
        return;
      }
      this.consumerChannel.consume(
        this.eventQueue,
        async (message: amqplib.ConsumeMessage | null) => {
          if (message !== null) {
            const headers = message.properties.headers || {};
            const requeueOptions = headers?.requeueOptions || {};
            const refineMessage = JSON.parse(message.content.toString());
            let isPoisonMessage = false;
            for (let handlerName in this.messageHandlerNameMap) {
              if (
                !requeueOptions[handlerName] ||
                requeueOptions[handlerName] <= this.maxRequeueCount
              ) {
                const isAlreadyHandled = await this.eventAlreadyAcknowledgement(
                  refineMessage.eventId,
                  handlerName,
                );
                if (isAlreadyHandled) {
                  console.log(handlerName, ' already handled');
                  continue;
                }
                if (
                  this.messageHandlerNameMap[handlerName] &&
                  typeof this.messageHandlerNameMap[handlerName] === 'function'
                ) {
                  let isSuccess = false;
                  for (
                    let tryCount = 0;
                    tryCount < this.maxRetryCount;
                    tryCount++
                  ) {
                    isSuccess =
                      await this.messageHandlerNameMap[handlerName](
                        refineMessage,
                      );
                    if (isSuccess) {
                      break;
                    }
                    console.log(handlerName, ' Retrying Count', tryCount + 1);
                  }
                  if (!isSuccess) {
                    await this.requeueAndAddCount(
                      headers,
                      refineMessage,
                      handlerName,
                    );
                  }
                } else {
                  console.log(handlerName, ' handler not found');
                }
              } else {
                if (this.consumerChannel) {
                  console.log(
                    'Message sent to dead letter queue with consumerTag: ',
                    message.fields.consumerTag,
                    'and deliveryTag: ',
                    message.fields.deliveryTag,
                  );
                  isPoisonMessage = true;
                  // reject the message and sent to dead letter queue
                  this.consumerChannel.reject(message, false);
                }
              }
            }
            if (!isPoisonMessage && this.consumerChannel) {
              this.consumerChannel.ack(message);
            }
          } else {
            console.log('Error in consuming event: ', message);
          }
        },
      );
    } catch (e) {
      console.log(e);
      await this.getRabbitMqServerForProcessor();
    }
  }

  async eventAlreadyAcknowledgement(eventId: number, handler: string) {
    const isAlreadyGoneThrough =
      await this.inboxRepo.getInboxEventUsingEventIdAndHandlerName(
        eventId,
        handler,
      );
    return !!isAlreadyGoneThrough;
  }

  async handleMail(refineMessage) {
    try {
      // console.log("Message consumed: ", refineMessage);
      await this.inboxRepo.addNewInboxEvent(
        refineMessage.eventId,
        'handleMail',
      );
      // mail logic here
      console.log('Mail sent successfully');
      return true;
    } catch (e) {
      console.log('Error in sending mail: ', e);
      return false;
    }
  }

  async handleNotification(refineMessage) {
    try {
      // console.log("Message consumed: ", refineMessage);
      await this.inboxRepo.addNewInboxEvent(
        refineMessage.eventId,
        'handleNotification',
      );
      // notification logic here
      console.log('Notification sent successfully');
      return true;
    } catch (e) {
      console.log('Error in sending notification: ', e);
      return false;
    }
  }

  async requeueAndAddCount(headers, refineMessage, HANDLER_NAME: string) {
    setTimeout(
      () => {
        const retryHeaders = {
          ...headers,
          requeueOptions: { ...(headers?.requeueOptions || {}) },
        };
        retryHeaders.requeueOptions[HANDLER_NAME] =
          (headers?.requeueOptions?.[HANDLER_NAME] ?? 0) + 1;
        if (this.consumerChannel) {
          this.consumerChannel.publish(
            this.eventExchange,
            'to-event-queue',
            Buffer.from(JSON.stringify(refineMessage)),
            { persistent: true, headers: retryHeaders },
          );
        }
        console.log(
          'Message requeue count: ',
          retryHeaders.requeueOptions[HANDLER_NAME],
        );
      },
      3 ** (headers?.requeueOptions?.[HANDLER_NAME] ?? 1) * 1000,
    );
  }

  // async handleConsumeDeadLetterEvent() {
  //     this.consumerChannel.consume(this.eventDeadLetterQueue, async (message) => {
  //         if (message !== null) {
  //             const HANDLER_NAME = 'handleConsumeDeadLetterEvent';
  //             const refineMessage = JSON.parse(message.content.toString());
  //             const isInDeadQueue = await this.inboxRepo.getInboxEventUsingEventIdAndHandlerName(refineMessage.eventId, "");
  //             if (!isInDeadQueue) {
  //                 this.consumerChannel.ack(message);
  //                 return;
  //             }
  //             const isUpdated = await this.inboxRepo.updateHandlerName(refineMessage.eventId, HANDLER_NAME);
  //             if (isUpdated) {
  //                 console.log("Message consumed by dead letter queue: ", refineMessage);
  //                 this.consumerChannel.ack(message);
  //             }
  //             else {
  //                 this.consumerChannel.reject(message, true);
  //             }
  //         }
  //         else {
  //             console.log("Error in consuming event: ", message);
  //             // reject the message and requeue it
  //             this.consumerChannel.reject(message, true);
  //         }
  //     });
  // }
}
