import { useEffect } from 'react';
import AssetList from '../components/Asset/List/AssetList';
import AssetCardStatus from '../components/Asset/Status/AssetCardStatus';
import EmojiOverlay from '../components/UI/EmojiOverlay';
import { useAppSelector } from '../hooks/redux-hook';
import { AssetDataType, CardDataType, getAssets, getCards } from '../util/api/assetAPI';
import classes from './Asset.module.css';
import { useDispatch } from 'react-redux';
import { assetActions } from '../store/asset';
import { uiActions } from '../store/ui';
export interface AssetProps {
  assets: AssetDataType[];
  cards: CardDataType[];
}

const Asset = () => {
  const dispatch = useDispatch();
  const { assets, cards } = useAppSelector((state) => state.asset);

  const dataExists = assets && cards;

  useEffect(() => {
    if (!assets || !cards) {
      dispatch(
        uiActions.showModal({
          description: '자산 또는 카드를 찾을 수 없습니다',
          confirmMsg: '다시 불러오기',
          onConfirm: async () => {
            try {
              if (!assets) {
                const { assets: assetData } = await getAssets();
                dispatch(assetActions.setAssets(assetData));
              }
              if (!cards) {
                const { cards: cardData } = await getCards();
                dispatch(assetActions.setCards(cardData));
              }
            } catch (error) {
              console.log(error);
              uiActions.showErrorModal({
                title: '',
                description: '자산 또는 카드를 불러오는 중 문제가 발생했습니다',
              });
            }
          },
        })
      );
    }
  }, [assets, cards, dataExists]);

  return (
    <>
      <header className={classes.header}>
        <h1>자산 및 결제수단</h1>
      </header>
      <main>
        {dataExists && (
          <>
            <AssetCardStatus assets={assets} cards={cards} />
            <hr />
            <AssetList assets={assets} cards={cards} />
          </>
        )}
      </main>
      <EmojiOverlay />
    </>
  );
};

export default Asset;
