import { AgreementModel } from "@models/agreement.model";
import { BackupEntity, BackupModel, EntityType } from "@models/backup.model";
import { BudgetModel } from "@models/budget.model";
import { ChallengeModel } from "@models/challenge.model";
import { ItemModel } from "@models/item.model";
import { PaymentModel } from "@models/payment.model";
import { TransactionModel } from "@models/transaction.model";
import { UserModel } from "@models/user.model";
import { UserAgreementModel } from "@models/userAgreement.model";
import { flatten } from "lodash";

export class BackupService {
  static readonly agreementModel = AgreementModel;
  static readonly budgetModel = BudgetModel;
  static readonly challengeModel = ChallengeModel;
  static readonly itemModel = ItemModel;
  static readonly paymentModel = PaymentModel;
  static readonly transactionModel = TransactionModel;
  static readonly userAgreementModel = UserAgreementModel;
  static readonly userModel = UserModel;
  static readonly backupModel = BackupModel;

  static async backup(): Promise<{
    uuid: string;
    created: number;
    expired: number;
  }> {
    const uuid = new Date().valueOf().toString();
    let created = 0,
      expired = 0;

    const createReqs = flatten(
      await Promise.all(
        Object.values(EntityType).map((entityType) =>
          this.getCreateBackupReqs(entityType, uuid)
        )
      )
    );

    if (createReqs.length) {
      const prevUuid = (
        await this.backupModel.findOne({
          isExpired: false,
        })
      )?.uuid;

      if (prevUuid) {
        expired = (
          await this.backupModel.updateMany(
            { uuid: prevUuid },
            { isExpired: true }
          )
        ).modifiedCount;
      }

      created = (await this.backupModel.insertMany(createReqs)).length;
    }

    return {
      uuid,
      created,
      expired,
    };
  }

  static async restore() {
    const uuid = (await this.backupModel.findOne({ isExpired: false }))?.uuid;

    if (!uuid) return;

    const backups = await this.backupModel.find({ uuid });

    const backupsByType = backups.reduce((prev, { entityType, payload }) => {
      const prevBackups = prev.get(entityType);

      if (prevBackups) {
        prevBackups.push(payload);
        prev.set(entityType, prevBackups);
      } else {
        prev.set(entityType, [payload]);
      }

      return prev;
    }, new Map<EntityType, Array<object>>());

    await Promise.all(
      Array.from(backupsByType.entries()).map(([entityType, payloads]) => {
        console.log("REQ: ", { entityType, paylodsLength: payloads.length });
        return this.getRestoreBackupReqs(entityType as EntityType, payloads);
      })
    );
  }

  private static async getRestoreBackupReqs(
    entityType: EntityType,
    payloads: Array<object>
  ) {
    switch (entityType) {
      case EntityType.Agreement:
        return this.agreementModel.insertMany(payloads);

      case EntityType.Budget:
        return this.budgetModel.insertMany(payloads);

      case EntityType.Challenge:
        return this.challengeModel.insertMany(payloads);

      case EntityType.Item:
        return this.itemModel.insertMany(payloads);

      case EntityType.Payment:
        return this.paymentModel.insertMany(payloads);

      case EntityType.Transaction:
        return this.transactionModel.insertMany(payloads);

      case EntityType.User:
        return this.userModel.insertMany(payloads);

      case EntityType.UserAgreement:
        return this.userAgreementModel.insertMany(payloads);

      default:
        throw new Error(`Unexpected Error; invalid entityType ${entityType}`);
    }
  }

  private static async getCreateBackupReqs(
    entityType: EntityType,
    uuid: string
  ): Promise<Array<BackupEntity>> {
    const createdAt = new Date();

    const entities = await (async () => {
      switch (entityType) {
        case EntityType.Agreement:
          return this.agreementModel.find();

        case EntityType.Budget:
          return this.budgetModel.find();

        case EntityType.Challenge:
          return this.challengeModel.find();

        case EntityType.Item:
          return this.itemModel.find();

        case EntityType.Payment:
          return this.paymentModel.find();

        case EntityType.Transaction:
          return this.transactionModel.find();

        case EntityType.User:
          return this.userModel.find();

        case EntityType.UserAgreement:
          return this.userAgreementModel.find();

        default:
          throw new Error(`Unexpected Error; invalid entityType ${entityType}`);
      }
    })();

    return entities.map((entity) => ({
      uuid,
      entityType,
      entityId: entity._id,
      payload: entity,
      isExpired: false,
      createdAt,
    }));
  }
}
