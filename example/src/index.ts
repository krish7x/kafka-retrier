import {
  KafkaConfig,
  EventQueueType,
  EventMessageType,
  KafkaRetrier,
} from "kafka-retrier";

const config: KafkaConfig = {
  clientId: "example_client_id",
  brokers: ["localhost:9092"],
  //ssl: { rejectUnauthorized: false },
};

const eventQueue: EventQueueType = {
  originalTopic: "ExampleOriginalTopic",
  retryTopic: "ExampleRetryTopic",
  dlqTopic: "ExampleDlqTopic",
  maxAllowedRetries: 5,
  maxAllowedDlqs: 1,
};

const performRetry = async () => {
  const obj = {
    source: "ExampleRetryTopic",
    data: "Hello world!",
  };
  const eventMessage: EventMessageType = {
    errorMessage: "Custom Error",
    originalPayload: obj,
    currentRetryAttempt: 0,
    currentDlqAttempt: 0,
  };
  const kafkaRetrier = new KafkaRetrier(config, eventQueue, eventMessage);
  await kafkaRetrier.retry();
};

const performRetryWithDlq = async () => {
  const obj = {
    source: "ExampleRetryTopic",
    data: "Hello world!",
  };
  const eventMessage: EventMessageType = {
    errorMessage: "Custom Error",
    originalPayload: obj,
    currentRetryAttempt: 5, //exhausted retry attempt
    currentDlqAttempt: 0,
  };
  const kafkaRetrier = new KafkaRetrier(config, eventQueue, eventMessage);
  await kafkaRetrier.retry();
};

const performDelayedRetry = async () => {
  const obj = {
    source: "ExampleRetryTopic",
    data: "Hello world!",
  };
  const eventMessage: EventMessageType = {
    errorMessage: "Custom Error",
    originalPayload: obj,
    currentRetryAttempt: 0,
    currentDlqAttempt: 0,
  };
  const kafkaRetrier = new KafkaRetrier(config, eventQueue, eventMessage);
  await kafkaRetrier.delayedRetry(5000); //5 secs
};

const performDelayedRetryWithDlq = async () => {
  const obj = {
    source: "ExampleRetryTopic",
    data: "Hello world!",
  };
  const eventMessage: EventMessageType = {
    errorMessage: "Custom Error",
    originalPayload: obj,
    currentRetryAttempt: 5, //exhausted retry attempt
    currentDlqAttempt: 0,
  };
  const kafkaRetrier = new KafkaRetrier(config, eventQueue, eventMessage);
  await kafkaRetrier.delayedRetry(5000); //5 secs
};

const performDlq = async () => {
  const obj = {
    source: "ExampleDlqTopic",
    data: "Hello world!",
  };
  const eventMessage: EventMessageType = {
    errorMessage: "Custom Error",
    originalPayload: obj,
    currentRetryAttempt: 5, //exhausted retry attempt
    currentDlqAttempt: 0,
  };
  const kafkaRetrier = new KafkaRetrier(config, eventQueue, eventMessage);
  await kafkaRetrier.dlq();
};

const performDelayedDlq = async () => {
  const obj = {
    source: "ExampleDlqTopic",
    data: "Hello world!",
  };
  const eventMessage: EventMessageType = {
    errorMessage: "Custom Error",
    originalPayload: obj,
    currentRetryAttempt: 5, //exhausted retry attempt
    currentDlqAttempt: 0,
  };
  const kafkaRetrier = new KafkaRetrier(config, eventQueue, eventMessage);
  await kafkaRetrier.delayedDlq(5000); //5 secs
};

// uncomment these functions to run independently
// performRetry();
// performRetryWithDlq();
// performDelayedRetry();
// performDelayedRetryWithDlq();
// performDlq()
// performDelayedDlq()
