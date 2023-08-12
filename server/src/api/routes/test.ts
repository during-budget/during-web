import express, { Request, Response } from "express";
const router = express.Router();

router.get("/echo", async (req: Request, res: Response) => {
  return res.status(200).send({ message: req.query.message });
});

export default router;
