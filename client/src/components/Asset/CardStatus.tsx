import { useState } from 'react';
import { AssetProps } from '../../screens/Asset';
import RadioTab from '../UI/RadioTab';
import CardList from './CardList';
import classes from './CardStatus.module.css';

const CardStatus = ({ assets, cards }: AssetProps) => {
  const [currentAssetId, setCurrentAssetId] = useState(assets[0]._id || '');

  const assetTabValues = assets.map((asset) => {
    return {
      label: asset.title,
      value: asset._id,
      checked: asset._id === currentAssetId,
      onChange: () => {
        setCurrentAssetId(asset._id);
      },
    };
  });

  const currentCards = cards.filter((card) => card.linkedAssetId === currentAssetId);

  return (
    <section className={classes.container}>
      <RadioTab name="asset-tab" values={assetTabValues} />
      <CardList className={classes.list} cards={currentCards} />
    </section>
  );
};

export default CardStatus;
