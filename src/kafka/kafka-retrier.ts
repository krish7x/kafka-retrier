import Producer from "./producer";
import EventQueue from "../dto/event-queue";
import EventMessage from "../dto/event-message";
import { KafkaConfig } from "kafkajs";
import { IEventQueue } from "../interface/event-queue-interface";
import { IEventMessage } from "../interface/event-message-interface";

export class KafkaRetrier {
  producer: Producer;
  eventQueue: EventQueue;
  eventMessage: EventMessage;

  constructor(
    config: KafkaConfig,
    eventQeue: IEventQueue,
    eventMessage: IEventMessage
  ) {
    const {
      originalTopic,
      retryTopic,
      dlqTopic,
      maxAllowedRetries,
      maxAllowedDlqs,
    } = eventQeue;
    this.producer = new Producer(config);
    this.eventQueue = new EventQueue(
      originalTopic,
      retryTopic,
      dlqTopic,
      maxAllowedRetries,
      maxAllowedDlqs
    );
    const {
      originalPayload,
      errorMessage,
      currentRetryAttempt,
      currentDlqAttempt,
    } = eventMessage;
    this.eventMessage = new EventMessage(
      originalPayload,
      errorMessage,
      currentRetryAttempt,
      currentDlqAttempt
    );
  }

  async retry(isRetriable: boolean = true, retryCallback?: () => void) {
    this.eventMessage.incrementRetryAttempt();
    if (isRetriable) {
      await this.publishToRetryTopic([
        {
          eventQueue: this.eventQueue,
          eventMessage: this.eventMessage,
        },
      ]);
    }
    if (typeof retryCallback === "function" && retryCallback) retryCallback();
  }

  async dlq(isDlqable: boolean = true, dlqCallback?: () => void) {
    this.eventMessage.resetRetryAttempt();
    this.eventMessage.incrementDlqAttempt();
    if (isDlqable) {
      await this.publishToDlqTopic([
        {
          eventQueue: this.eventQueue,
          eventMessage: this.eventMessage,
        },
      ]);
    }
    if (typeof dlqCallback === "function" && dlqCallback) dlqCallback();
  }

  async delayedRetry(
    delayMilliseconds: number,
    isRetriable: boolean = true,
    retryCallback?: () => void
  ) {
    const intervalId = setTimeout(async () => {
      await this.retry(isRetriable, retryCallback);
      clearTimeout(intervalId);
    }, delayMilliseconds);
  }

  async delayedDlq(
    delayMilliseconds: number,
    isDlqable: boolean = true,
    dlqCallback?: () => void
  ) {
    const intervalId = setTimeout(async () => {
      await this.dlq(isDlqable, dlqCallback);
      clearTimeout(intervalId);
    }, delayMilliseconds);
  }

  async publishToRetryTopic(payload: object[]) {
    if (!this.isRetryAttemptExhausted()) {
      const topic = this.eventQueue.retryTopic;
      await this.producer.start();
      this.producer.sendBatch(payload, topic);
    } else {
      if (this.canPerformDlq) {
        this.dlq();
      }
    }
  }

  async publishToDlqTopic(payload: object[]) {
    if (!this.isDlqAttemptExhausted()) {
      const topic = this.eventQueue.dlqTopic;
      await this.producer.start();
      this.producer.sendBatch(payload, topic);
    }
  }

  isRetryAttemptExhausted(): boolean {
    return (
      this.eventMessage.currentRetryAttempt > this.eventQueue.maxAllowedRetries
    );
  }

  isDlqAttemptExhausted(): boolean {
    return this.eventMessage.currentDlqAttempt > this.eventQueue.maxAllowedDlqs;
  }

  canPerformDlq(): boolean {
    return this.eventQueue.maxAllowedDlqs > 0;
  }
}
