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
import { KafkaRetrier } from 'kafka-retrier';
import { KafkaConfig } from 'kafkajs';
import { IEventQueue, IEventMessage } from 'your-event-queue-interface-path';
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

const canPerformDlq: boolean = true; // Set to true if DLQ is enabled
```

### 3. Create Kafka Retrier instance

```typescript
const kafkaRetrier = new KafkaRetrier(kafkaConfig, eventQueue, eventMessage, canPerformDlq);
```

### 4. Retry Mechanism

```typescript
async function retryCallback() {
  // Custom retry logic here
}

await kafkaRetrier.retry(true, retryCallback);
```

### 5. Dead-Letter-Queue (DLQ) Mechanism

```typescript
async function dlqCallback() {
  // Custom DLQ logic here
}

await kafkaRetrier.dlq(true, dlqCallback);
}
```

### Contributing

Feel free to contribute by opening issues or submitting pull requests.
