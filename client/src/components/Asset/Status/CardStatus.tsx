import { useEffect, useMemo, useState } from 'react';
import { AssetProps } from '../../../screens/Asset';
import EditButton from '../../UI/EditButton';
import Inform from '../../UI/Inform';
import RadioTab from '../../UI/RadioTab';
import CardList from '../List/CardList';
import classes from '../Status/CardStatus.module.css';

export interface CardStatusProps extends AssetProps {
  openListEditor?: (payload: { isAsset: boolean }) => void;
  openEditor?: (payload: { isAsset: boolean }) => void;
}

const CardStatus = ({ assets, cards, openEditor, openListEditor }: CardStatusProps) => {
  const [currentAssetId, setCurrentAssetId] = useState(assets[0]?._id || undefined);

  useEffect(() => {
    setCurrentAssetId((prev) => {
      if (!prev) {
        return assets[0]?._id;
      } else {
        return prev;
      }
    });
  }, cards);

  const assetTabValues = useMemo(() => {
    const assetList = assets.map((asset) => {
      return {
        label: asset.title,
        value: asset._id,
        checked: asset._id === currentAssetId,
        onChange: () => {
          setCurrentAssetId(asset._id);
        },
      };
    });

    const unlinkedAssetIdExists = cards.find((card) => !card.linkedAssetId);

    if (unlinkedAssetIdExists) {
      assetList.push({
        label: '연결계좌 없음',
        value: '',
        checked: !currentAssetId || (assets.length === 0 && cards.length > 0),
        onChange: () => {
          setCurrentAssetId(undefined);
        },
      });
    }

    return assetList;
  }, [assets, cards, currentAssetId]);

  const currentCards = useMemo(
    () =>
      cards.filter((card) => {
        return card.linkedAssetId === currentAssetId;
      }),
    [cards, currentAssetId]
  );

  return (
    <section className={classes.container}>
      <RadioTab name="asset-tab" values={assetTabValues} />
      {cards.length === 0 ? (
        <div onClick={openEditor && openEditor.bind(undefined, { isAsset: false })}>
          <Inform isError={false} className={classes.inform}>
            사용중인 체크카드, 신용카드를 등록해주세요.
          </Inform>
        </div>
      ) : (
        <CardList className={classes.list} cards={currentCards} />
      )}

      <div className={classes.buttons}>
        {openListEditor && (
          <EditButton
            label="카드 편집"
            onClick={openListEditor.bind(undefined, { isAsset: false })}
          />
        )}
        {openEditor && (
          <EditButton
            label="카드 추가"
            icon='plus'
            onClick={openEditor.bind(undefined, { isAsset: false })}
          />
        )}
      </div>
    </section>
  );
};

export default CardStatus;
