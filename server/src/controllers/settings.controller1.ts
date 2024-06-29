import { FieldInvalidError, FieldRequiredError } from "src/errors/InvalidError";
import { PaymentNotFoundError } from "src/errors/NotFoundError";
import { Request, Response } from "express";
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
      if (!payment) throw new PaymentNotFoundError();
    }
    if (!SettingService.isValidChartSkinOption(chartSkin))
      throw new FieldInvalidError("chartSkin");
    await SettingService.updateChartSkinSetting(user, chartSkin);
  }

  if (timeZone) {
    if (!SettingService.isValidTimeZoneOption(timeZone))
      throw new FieldInvalidError("timeZone");
    await SettingService.updateTimeZoneSetting(user, timeZone);
  }

  if (theme) {
    if (!SettingService.isValidThemeOption(theme))
      throw new FieldInvalidError("theme");
    await SettingService.updateThemeSetting(user, theme);
  }

  return res.status(200).send({
    settings: user.settings,
  });
};

export const options = async (req: Request, res: Response) => {
  if (!("field" in req.query)) throw new FieldRequiredError("field");
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
  throw new FieldInvalidError("field");
};
