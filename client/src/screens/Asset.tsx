import { useEffect } from 'react';
import AssetList from '../components/Asset/List/AssetList';
import AssetCardStatus from '../components/Asset/Status/AssetCardStatus';
import EmojiOverlay from '../components/UI/EmojiOverlay';
import { useAppSelector } from '../hooks/redux-hook';
import { AssetDataType, CardDataType, getAssets, getCards } from '../util/api/assetAPI';
import classes from './Asset.module.css';
import { useDispatch } from 'react-redux';
import { assetActions } from '../store/asset';
export interface AssetProps {
  assets: AssetDataType[];
  cards: CardDataType[];
}

const Asset = () => {
  const dispatch = useDispatch();
  const { assets, cards } = useAppSelector((state) => state.asset);

  const dataExists = assets && cards;

  // TODO: 에러 모달 띄우고, 유저가 클릭해서 재요청하는 걸로... 이거 무한루프 가능성 있어 보임
  // useEffect(() => {
  //   const getData = async () => {
  //     if (!assets) {
  //       const { assets: assetData } = await getAssets();
  //       dispatch(assetActions.setAssets(assetData));
  //     }
  //     if (!cards) {
  //       const { cards: cardData } = await getCards();
  //       dispatch(assetActions.setCards(cardData));
  //     }
  //   };

  //   try {
  //     getData();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [assets, cards, dataExists]);

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
