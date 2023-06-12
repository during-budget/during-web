import { ChartSkinType } from '../../constants/chart-skin';
import { checkNetwork } from '../network';

const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/settings`;

export interface SettingDataType {
  chartSkin: ChartSkinType;
  timeZone: string;
}

interface OptionDataType {
  default: string;
  options: ValueType[];
}

export type OptionFieldType = 'chartSkin';
export type ValueFieldType = 'timeZone';
export type FieldType = OptionFieldType | ValueFieldType;

export type ValueType = ChartSkinType;

export const getSettings = async () => {
  checkNetwork();

  let data, response;
  try {
    response = await fetch(BASE_URL, {
      credentials: 'include',
    });

    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '설정 데이터 로드 중 문제가 발생했습니다.');
  }

  return data as { settings: SettingDataType };
};

export const getOptions = async (field: string) => {
  checkNetwork();

  const url = `${BASE_URL}/options?field=${field}`;

  let data, response;
  try {
    response = await fetch(url, {
      credentials: 'include',
    });

    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '설정 옵션 데이터 로드 중 문제가 발생했습니다.');
  }

  return data as OptionDataType;
};

export const updateChartSkin = async (chartSkin: ChartSkinType) => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(BASE_URL, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({ chartSkin }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '차트 스킨 업데이트 중 문제가 발생했습니다.');
  }

  return data as { settings: SettingDataType };
};
