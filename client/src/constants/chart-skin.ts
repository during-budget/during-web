type SkinDataType = {
  [key in ChartSkinType]: {
    id: ChartSkinType;
    name: string;
    hideRoundedDeg: number;
    hideCoverDeg: number;
  };
};

export type ChartSkinType = 'basic' | 'cat' | 'bunny' | 'bear';

export const SKIN_DATA: SkinDataType = {
  cat: {
    id: 'cat',
    name: '뾰족귀듀링',
    hideRoundedDeg: 352,
    hideCoverDeg: 340,
  },
  bunny: {
    id: 'bunny',
    name: '긴귀듀링',
    hideRoundedDeg: 338,
    hideCoverDeg: 320,
  },
  bear: {
    id: 'bear',
    name: '둥근귀듀링',
    hideRoundedDeg: 351,
    hideCoverDeg: 340,
  },
  basic: {
    id: 'basic',
    name: '민둥듀링',
    hideRoundedDeg: 360,
    hideCoverDeg: 340,
  },
};
