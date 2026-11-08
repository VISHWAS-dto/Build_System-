import { bootstrap } from "./bootstrap/index.js";
import { loadConfig } from "./bootstrap/config.js";
import { initProcessHandlers } from "./bootstrap/process-handlers.js";

const config = loadConfig();
const app = await bootstrap(config);
initProcessHandlers(app);

try {
  await app.listen({ host: config.HOST, port: config.PORT });
} catch (err) {
  app.log.error({ err }, "failed to start server");
  process.exit(1);
}
