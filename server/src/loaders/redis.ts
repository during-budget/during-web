import { createClient } from "redis";
import { exit } from "src/utils/process";

let client: any = null;

const loader = async (config: { REDIS_URL: string }) => {
  try {
    client = createClient({
      url: config.REDIS_URL,
      legacyMode: true,
    });
    await client.connect();
    console.log("✅ Redis is connected");
  } catch (err) {
    exit("Failed to connect Redis");
  }
};

export { loader, client };
