import { isConnected as isMongoDBConnected } from "./_mongooseConfig";
import { isConnected as isRedisConnected } from "./_redisConfig";

export const isDBConnected = () => isMongoDBConnected && isRedisConnected;

export const ready = async () => {
  return await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (isDBConnected()) {
        console.log("DB connection is made");
        resolve("foo");
        clearInterval(interval);
      } else {
        console.log("waiting for connection...");
      }
    }, 2000);
  });
};
