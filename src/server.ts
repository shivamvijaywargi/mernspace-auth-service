import app from "./app";
import { CONFIG } from "./config";

const PORT = parseInt(CONFIG.PORT || "5000", 10);

const startServer = (PORT: number) => {
  try {
    app.listen(PORT, () => {
      // console.log(`App is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    // console.log(`Error while starting the server: ${error}`);
  }
};

startServer(PORT);
