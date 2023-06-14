type SkinDataType = {
  [key in ChartSkinType]: { name: ChartSkinType; hideRoundedDeg: number; hideCoverDeg: number };
}

export type ChartSkinType = 'basic' | 'cat' | 'bunny' | 'bear';

export const SKIN_DATA: SkinDataType = {
  cat: {
    name: 'cat',
    hideRoundedDeg: 352,
    hideCoverDeg: 340,
  },
  bunny: {
    name: 'bunny',
    hideRoundedDeg: 338,
    hideCoverDeg: 320,
  },
  bear: {
    name: 'bear',
    hideRoundedDeg: 351,
    hideCoverDeg: 340,
  },
  basic: {
    name: 'basic',
    hideRoundedDeg: 360,
    hideCoverDeg: 340,
  },
};
