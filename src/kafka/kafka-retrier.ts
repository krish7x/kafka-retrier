import Producer from "./producer";
import EventQueue from "../dto/event-queue";
import EventMessage from "../dto/event-message";
import { KafkaConfig } from "kafkajs";
import { IEventQueue } from "../interface/event-queue-interface";
import { IEventMessage } from "../interface/event-message-interface";
import {
  IDelayedDlq,
  IDelayedRetry,
  IDlq,
  IRetry,
} from "src/interface/kafka-retrier-interface";

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
    ).validate();
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
    ).validate();
  }

  async retry({ isRetriable = true, retryCallback, dlqCallback }: IRetry) {
    this.eventMessage.incrementRetryAttempt();
    if (isRetriable) {
      await this.publishToRetryTopic([
        {
          eventQueue: this.eventQueue,
          eventMessage: this.eventMessage,
        },
        dlqCallback,
      ]);
    }
    if (typeof retryCallback === "function" && retryCallback) retryCallback();
  }

  async dlq({ isDlqable = true, dlqCallback }: IDlq) {
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

  async delayedRetry({
    isRetriable = true,
    delayMilliseconds,
    retryCallback,
    dlqCallback,
  }: IDelayedRetry) {
    const intervalId = setTimeout(async () => {
      await this.retry({ isRetriable, retryCallback, dlqCallback });
      clearTimeout(intervalId);
    }, delayMilliseconds);
  }

  async delayedDlq({
    isDlqable = true,
    delayMilliseconds,
    dlqCallback,
  }: IDelayedDlq) {
    const intervalId = setTimeout(async () => {
      await this.dlq({ isDlqable, dlqCallback });
      clearTimeout(intervalId);
    }, delayMilliseconds);
  }

  async publishToRetryTopic(payload: object[], dlqCallback?: () => void) {
    if (!this.isRetryAttemptExhausted()) {
      const topic = this.eventQueue.retryTopic;
      await this.producer.start();
      this.producer.sendBatch(payload, topic);
    } else {
      if (this.canPerformDlq) {
        this.dlq({ isDlqable: true, dlqCallback });
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
