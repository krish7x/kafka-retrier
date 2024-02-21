import { IEventQueue } from "./interface/event-queue-interface";
import { IEventMessage } from "./interface/event-message-interface";
import { KafkaRetrier } from "./kafka/kafka-retrier";
import { KafkaConfig } from "kafkajs";
import Producer from "./kafka/producer";

export type {
  KafkaConfig,
  IEventQueue as EventQueueType,
  IEventMessage as EventMessageType,
};

export { KafkaRetrier, Producer };
