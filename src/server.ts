import app from "./app";
import { CONFIG } from "./config";
import { logger } from "./config/logger";

const PORT = parseInt(CONFIG.PORT || "5000", 10);

const startServer = (PORT: number) => {
  try {
    app.listen(PORT, () => {
      logger.info(`App is running at http://localhost:${PORT}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`Error while starting the server: ${err.message}`);

      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

startServer(PORT);
