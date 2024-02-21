import isEmpty from "../utils/isEmpty";

export default class EventQueue {
  originalTopic: string;
  retryTopic: string;
  dlqTopic: string;
  maxAllowedRetries: number;
  maxAllowedDlqs: number;

  constructor(
    originalTopic: string,
    retryTopic: string,
    dlqTopic: string,
    maxAllowedRetries: number,
    maxAllowedDlqs: number
  ) {
    this.originalTopic = originalTopic;
    this.retryTopic = retryTopic;
    this.dlqTopic = dlqTopic;
    this.maxAllowedRetries = maxAllowedRetries;
    this.maxAllowedDlqs = maxAllowedDlqs;
    this.validate();
  }

  validate() {
    if (isEmpty(this.originalTopic))
      throw new Error(
        "Original topic should be present and it must be a string"
      );
    if (isEmpty(this.retryTopic))
      throw new Error("Retry topic should be present and it must be a string");
    if (isEmpty(this.dlqTopic))
      throw new Error("Dlq topic should be present and it must be a string");
    if (this.maxAllowedDlqs < 1)
      throw new Error("Max Allowed Dlq should be greater than 0");
  }
}
