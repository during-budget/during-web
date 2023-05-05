import { useMemo, useState } from 'react';
import { AssetProps } from '../../../screens/Asset';
import EditButton from '../../UI/EditButton';
import Inform from '../../UI/Inform';
import RadioTab from '../../UI/RadioTab';
import CardList from '../List/CardList';
import classes from '../Status/CardStatus.module.css';

export interface CardStatusProps extends AssetProps {
  openEditor?: (payload: { isAsset: boolean }) => void;
}

const CardStatus = ({ assets, cards, openEditor }: CardStatusProps) => {
  const [currentAssetId, setCurrentAssetId] = useState(assets[0]?._id || '');

  const assetTabValues = useMemo(
    () =>
      assets.map((asset) => {
        return {
          label: asset.title,
          value: asset._id,
          checked: asset._id === currentAssetId,
          onChange: () => {
            setCurrentAssetId(asset._id);
          },
        };
      }),
    [assets, currentAssetId]
  );

  const currentCards = useMemo(
    () => cards.filter((card) => card.linkedAssetId === currentAssetId),
    [cards, currentAssetId]
  );

  return (
    <section className={classes.container}>
      <RadioTab name="asset-tab" values={assetTabValues} />
      {assets.length === 0 ? (
        <Inform isError={false}>계좌에 연결된 카드가 있다면 등록해주세요.</Inform>
      ) : (
        <CardList className={classes.list} cards={currentCards} />
      )}
      {openEditor && (
        <EditButton
          label="카드 편집"
          onClick={openEditor.bind(null, { isAsset: false })}
        />
      )}
    </section>
  );
};

export default CardStatus;
