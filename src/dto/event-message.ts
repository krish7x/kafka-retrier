import isEmpty from "../utils/isEmpty";

export default class EventMessage {
  originalPayload: object;
  errorMessage: string | object;
  currentRetryAttempt: number = 0;
  currentDlqAttempt: number = 0;
  constructor(
    originalPayload: object,
    errorMessage: string | object,
    currentRetryAttempt: number,
    currentDlqAttempt: number
  ) {
    this.originalPayload = originalPayload;
    this.errorMessage = errorMessage;
    this.currentRetryAttempt = currentRetryAttempt;
    this.currentDlqAttempt = currentDlqAttempt;
    this.validate();
  }

  resetRetryAttempt() {
    this.currentRetryAttempt = 0;
  }

  incrementRetryAttempt() {
    this.currentRetryAttempt += 1;
  }

  incrementDlqAttempt() {
    this.currentDlqAttempt += 1;
  }

  updateErrorMessage(errorMessage: string | object) {
    this.errorMessage = errorMessage;
  }

  validate() {
    if (isEmpty(this.originalPayload) || isEmpty(this.errorMessage))
      throw new Error("Orginal Payload or Error Message should be present");
  }
}
