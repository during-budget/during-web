import express, { Request, Response } from "express";
import { API_KEY_COOKIE, API_KEYS } from "src/loaders/express";
import { randomKey } from "src/utils/crypto";
const router = express.Router();

router.post("/generate-api-key", (req: Request, res: Response) => {
  const key = randomKey(32);
  console.info(`🔑 API Key is generated: ${key}`);

  if (API_KEYS.size >= 10) {
    API_KEYS.clear();
    console.info("🔑 Previous API keys are expired");
  }

  API_KEYS.add(key);

  res.cookie(API_KEY_COOKIE, key.slice(0,4)+"*".repeat(28), { httpOnly: true, secure: true, sameSite: 'none' });

  return res.status(200).send({
    code: "API_KEY_GENERATED",
    message: "API key is generated; Please check log",
  });
});

export default router;
