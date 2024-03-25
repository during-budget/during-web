type SkinDataType = {
  [key in ChartSkinType]: {
    id: ChartSkinType;
    name: string;
    hideRoundedDeg: number;
    hideCoverDeg: number;
  };
};

// NOTE: DO NOT CHANGE TYPES
export type ChartSkinType = 'basic' | 'cat' | 'bunny' | 'bear';

export const SKIN_DATA: SkinDataType = {
  cat: {
  id: 'cat',
    name: '고양이 듀링 스킨',
    hideRoundedDeg: 352,
    hideCoverDeg: 340,
  },
  bunny: {
    id: 'bunny',
    name: '토끼 듀링 스킨',
    hideRoundedDeg: 338,
    hideCoverDeg: 320,
  },
  bear: {
    id: 'bear',
    name: '곰돌이 듀링 스킨',
    hideRoundedDeg: 351,
    hideCoverDeg: 340,
  },
  basic: {
    id: 'basic',
    name: '민둥 듀링 스킨',
    hideRoundedDeg: 360,
    hideCoverDeg: 340,
  },
};
