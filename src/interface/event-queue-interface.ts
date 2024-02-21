export interface IEventQueue {
  originalTopic: string;
  retryTopic: string;
  dlqTopic: string;
  maxAllowedRetries: number;
  maxAllowedDlqs: number;
}
