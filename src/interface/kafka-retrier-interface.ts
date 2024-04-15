export interface IRetry {
  isRetriable?: boolean;
  retryCallback?: () => void;
  dlqCallback?: () => void;
}

export interface IDelayedRetry {
  isRetriable?: boolean;
  delayMilliseconds: number;
  retryCallback?: () => void;
  dlqCallback?: () => void;
}

export interface IDlq {
  isDlqable?: boolean;
  dlqCallback?: () => void;
}

export interface IDelayedDlq {
  isDlqable?: boolean;
  delayMilliseconds: number;
  dlqCallback?: () => void;
}
