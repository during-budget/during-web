import { ChartSkinType } from '../../components/Budget/Amount/AmountRing';

const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/settings`;

export interface SettingType {
  chartSkin: ChartSkinType;
}

export const getSettings = async () => {
  const response = await fetch(BASE_URL, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    console.error(`Failed to get settings.\n${data.message ? data.message : ''}`);
    return null;
  }

  return response.json() as Promise<{ settings: SettingType }>;
};

export const updateChartSkin = async (chartSkin: ChartSkinType) => {
  const response = await fetch(BASE_URL, {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify({ chartSkin }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to update chart skin.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{ settings: SettingType }>;
};
