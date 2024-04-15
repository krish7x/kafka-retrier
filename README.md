# Kafka Retirer

Kafka Retirer is a Node.js package that provides a convenient way to handle Kafka message retries and dead-letter-queue (DLQ) mechanisms. It is designed to be easily integrated into your Kafka message processing workflows.

## Installation

Install the package using npm:

```bash
npm install kafka-retrier
```

## Usage

### 1. Import the necessary classes

```typescript
import { KafkaRetrier } from "kafka-retrier";
import { KafkaConfig } from "kafkajs";
import { IEventQueue, IEventMessage } from "your-event-queue-interface-path";
```

### 2. Configure Kafka Retrier

```typescript
const kafkaConfig: KafkaConfig = {
  // Your Kafka configuration options
};

const eventQueue: IEventQueue = {
  // Your event queue configuration
};

const eventMessage: IEventMessage = {
  // Your event message configuration
};
```

### 3. Create Kafka Retrier instance

```typescript
const kafkaRetrier = new KafkaRetrier(kafkaConfig, eventQueue, eventMessage);
```

### 4. Retry Mechanism

```typescript
async function retryCallback() {
  // Custom retry logic here
}

await kafkaRetrier.retry({ retryCallback: retryCallback });
```

### 5. Delayed Retry Mechanism

```typescript
async function retryCallback() {
  // Custom retry logic here
}

await kafkaRetrier.delayedRetry({
  delayMilliseconds: 5000,
  retryCallback: retryCallback,
});
```

### 6. Dead-Letter-Queue (DLQ) Mechanism

```typescript
async function dlqCallback() {
  // Custom DLQ logic here
}

await kafkaRetrier.dlq({
  dlqCallback: dlqCallback
});
}
```

## Example

In the "example" folder you can find an implementation of the Kafka retry mechanism. The implementation includes a `KafkaRetrier` class that provides functionality for retrying and moving messages to the DLQ based on specified conditions.

To explore the example, navigate to the "example" folder and review the code in the `src/index.js` file. This demonstrates how to use the `KafkaRetrier` class for handling retries and DLQ in a Kafka setup.

```bash
cd example
npm install
npm run build # run this in terminal 1
#(or)
npm run dev # run this in terminal 1
npm run start # run this in terminal 2
```

### Contributing

Feel free to contribute by opening issues or submitting pull requests.
