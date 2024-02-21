import {
  Kafka,
  KafkaConfig,
  Message,
  Partitioners,
  Producer,
  ProducerRecord,
} from "kafkajs";

export default class KafkaProducer {
  private producer: Producer;

  constructor(config: KafkaConfig) {
    this.producer = this.createProducer(config);
  }

  public async start(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      console.log("Error connecting the producer: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  public async sendBatch(messages: object[], topic: string): Promise<void> {
    const kafkaMessages: Message[] = messages.map((message) => {
      return {
        value: JSON.stringify(message),
      };
    });
    const record: ProducerRecord = {
      messages: kafkaMessages,
      topic,
    };
    await this.producer.send(record);
  }

  private createProducer(config: KafkaConfig): Producer {
    const kafka = new Kafka(config);

    return kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }
}
