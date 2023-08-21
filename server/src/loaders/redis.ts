import { createClient } from "redis";

let client: any = null;

const loader = async (config: { REDIS_URL: string }) => {
  let connected = false;

  while (!connected) {
    try {
      client = createClient({
        url: config.REDIS_URL,
        legacyMode: true,
      });
      await client.connect();
      connected = true;
      console.log("✅ Redis is connected");
    } catch (err) {
      console.log("❌ Error connecting to Redis... try again");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

export { loader, client };
