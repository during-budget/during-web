import express, { Request, Response } from "express";
import { isAdmin } from "../middleware/auth";
import { wrapAsync } from "../middleware/error";
import { BackupService } from "../services/backup.service";

const router = express.Router();

// router.post(
//   "/backup",
//   isAdmin,
//   wrapAsync(async (req: Request, res: Response) => {
//     const { uuid, created, expired } = await BackupService.backup();

//     return res.status(200).send({
//       result: `${created} backupEntities with uuid ${uuid} are stored. ${expired} backupEntities are expired.`,
//     });
//   })
// );

// router.post(
//   "/restore",
//   isAdmin,
//   wrapAsync(async (req: Request, res: Response) => {
//     await BackupService.restore();

//     return res.status(200).send({
//       result: "Restored",
//     });
//   })
// );

export default router;
