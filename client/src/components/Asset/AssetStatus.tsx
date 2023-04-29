import React from 'react';
import AmountBars from '../Budget/Amount/AmountBars';
import classes from './AssetStatus.module.css';
import { AssetDataType, CardDataType } from '../../util/api/assetAPI';

interface AssetStatusProps {
  assets: AssetDataType[];
  cards: CardDataType[];
}

const AssetStatus = ({ assets, cards }: AssetStatusProps) => {
  return <section>AssetStatus</section>;
};

export default AssetStatus;
