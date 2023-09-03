import { Request, Response } from "express";
import { FIELD_INVALID, FIELD_REQUIRED, NOT_FOUND } from "src/api/message";
import * as PaymentService from "src/services/payments";
import { SettingService } from "src/services/users";

export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  return res.status(200).send({
    settings: user.settings,
  });
};

export const update = async (req: Request, res: Response) => {
  const user = req.user!;

  const { chartSkin, timeZone, theme } = req.body;

  if (chartSkin) {
    if (!SettingService.isFreeChartSkinOption(chartSkin)) {
      const { payment } = await PaymentService.findPaymentChartSkinPaidByTitle(
        user._id,
        chartSkin
      );
      if (!payment) {
        return res.status(409).send({ message: NOT_FOUND("payment") });
      }
    }
    if (!SettingService.isValidChartSkinOption(chartSkin)) {
      return res.status(400).send({ message: FIELD_INVALID("chartSkin") });
    }
    await SettingService.updateChartSkinSetting(user, chartSkin);
  }

  if (timeZone) {
    if (!SettingService.isValidTimeZoneOption(timeZone)) {
      return res.status(400).send({ message: FIELD_INVALID("timeZone") });
    }
    await SettingService.updateTimeZoneSetting(user, timeZone);
  }

  if (theme) {
    if (!SettingService.isValidThemeOption(theme)) {
      return res.status(400).send({ message: FIELD_INVALID("theme") });
    }
    await SettingService.updateThemeSetting(user, theme);
  }

  return res.status(200).send({
    settings: user.settings,
  });
};

export const options = async (req: Request, res: Response) => {
  if (!("field" in req.query)) {
    return res.status(400).send({ message: FIELD_REQUIRED("field") });
  }
  if (req.query.field === "chartSkin") {
    const user = req.user!;
    const { defaultOptions, options } =
      await SettingService.findChartSkinOptionsPaid(user._id);
    return res.status(200).send({
      default: defaultOptions,
      options,
    });
  }
  if (req.query.field === "timeZone") {
    const { defaultOptions, options } = SettingService.findTimeZoneOptions();
    return res.status(200).send({
      default: defaultOptions,
      options,
    });
  }
  if (req.query.field === "theme") {
    const { defaultOptions, options } = SettingService.findThemeOptions();
    return res.status(200).send({
      default: defaultOptions,
      options,
    });
  }
  return res.status(400).send({ message: FIELD_INVALID("field") });
};
