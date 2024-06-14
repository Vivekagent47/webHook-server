export type IConnectionRules = {
  delay: number;
  retryAttempts: number;
  retryStrategy: "exponential" | "fixed";
  retryDelay: number;
};
