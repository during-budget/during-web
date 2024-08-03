import express, { Request, Response } from "express";
import { API_KEYS } from "src/loaders/express";
import { randomKey } from "src/utils/crypto";
const router = express.Router();

router.get("/generate-api-key", (req: Request, res: Response) => {
  const key = randomKey(32);

  if (API_KEYS.size >= 10) {
    API_KEYS.clear();
  }

  API_KEYS.add(key);

  console.info(`🔑 API Key is generated(${API_KEYS.size}/10): ${key}`);

  const maskedKey = key.slice(0, 4) + "*".repeat(28);

  return res.status(200).send({
    code: "API_KEY_GENERATED",
    message: `API key is generated(${maskedKey}); Please check log`,
  });
});

export default router;
