import { createClient } from "redis";

const client = createClient({
  url: process.env["REDIS_URL"],
  legacyMode: true,
});
let isConnected = false;

client.connect();

client.on("error", function (err: any) {
  console.log("Redis connection error: " + err);
});
client.on("ready", () => {
  // or "connect"
  console.log("✅ Redis is connected");
  isConnected = true;
});

export { client, isConnected };
