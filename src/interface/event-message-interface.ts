export interface IEventMessage {
  originalPayload: object;
  errorMessage: string | object;
  currentRetryAttempt?: number;
  currentDlqAttempt?: number;
}
