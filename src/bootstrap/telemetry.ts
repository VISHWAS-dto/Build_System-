import type { Config } from "./config.js";

/**
 * Tracing setup. Runs BEFORE the app is created so libraries can be instrumented.
 * Skeleton only: plug OpenTelemetry (or another vendor SDK) in here later.
 */
export const initTelemetry = (config: Config): void => {
  if (!config.TELEMETRY_ENABLED) return;
  // TODO: start the tracing SDK here.
};
