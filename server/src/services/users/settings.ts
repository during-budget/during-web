import { UserEntity } from "@models/user.model";
import moment from "moment";
import { HydratedDocument, Types } from "mongoose";
import {
  basicTimeZone,
  basicTheme,
  themes,
  ChartSkinTitle,
  basicChartSkin,
} from "src/models/_basicSettings";

import * as PaymentService from "src/services/payments";

export const isFreeChartSkinOption = (chartSkin: string) =>
  chartSkin === ChartSkinTitle.Basic;

export const isValidChartSkinOption = (
  _chartSkin: string
): _chartSkin is ChartSkinTitle =>
  Object.values(ChartSkinTitle).some((chartSkin) => chartSkin === _chartSkin);

export const isValidTimeZoneOption = (timeZone: string) =>
  moment.tz.zone(timeZone);

export const isValidThemeOption = (theme: string) => themes.includes(theme);

export const findChartSkinOptionsPaid = async (userId: Types.ObjectId) => {
  const { payments: paymentRecords } =
    await PaymentService.findPaymentsChartSkinPaid(userId);

  return {
    defaultOptions: basicChartSkin,
    options: [
      basicChartSkin,
      ...paymentRecords.map((paymentRecord) => paymentRecord.itemTitle),
    ],
  };
};

export const findTimeZoneOptions = () => {
  return {
    defaultOptions: basicTimeZone,
    options: moment.tz.names(),
  };
};

export const findThemeOptions = () => {
  return {
    defaultOptions: basicTheme,
    options: themes,
  };
};

export const updateChartSkinSetting = async (
  userRecord: HydratedDocument<UserEntity>,
  chartSkin: ChartSkinTitle
) => {
  userRecord.settings = { ...userRecord.settings, chartSkin };
  await userRecord.save();
};

export const updateTimeZoneSetting = async (
  userRecord: HydratedDocument<UserEntity>,
  timeZone: string
) => {
  userRecord.settings = { ...userRecord.settings, timeZone };
  await userRecord.save();
};

export const updateThemeSetting = async (
  userRecord: HydratedDocument<UserEntity>,
  theme: string
) => {
  userRecord.settings = { ...userRecord.settings, theme };
  await userRecord.save();
};
