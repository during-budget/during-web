import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AssetList from '../components/Asset/List/AssetList';
import AssetCardStatus from '../components/Asset/Status/AssetCardStatus';
import EmojiOverlay from '../components/UI/overlay/EmojiOverlay';
import { useAppSelector } from '../hooks/useRedux';
import { assetActions } from '../store/asset';
import { uiActions } from '../store/ui';
import { AssetDataType, CardDataType, getAssets, getCards } from '../util/api/assetAPI';
import { getErrorMessage } from '../util/error';
import classes from './Asset.module.css';
import { useNavigate } from 'react-router';
export interface AssetProps {
  assets: AssetDataType[];
  cards: CardDataType[];
}

const Asset = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assets, cards } = useAppSelector((state) => state.asset);

  const dataExists = assets && cards;

  useEffect(() => {
    // NOTE: 오버레이를 닫아도 전체 페이지를 리로드하지 않도록 해시를 추가하여 해시 간의 이동으로 간주되도록 처리
    navigate('/asset#base', { replace: true });
  }, []);

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
              const message = getErrorMessage(error);
              uiActions.showErrorModal({
                title: '',
                description:
                  message || '자산 또는 카드를 불러오는 중 문제가 발생했습니다',
              });
              if (!message) throw error;
            }
          },
        })
      );
    }
  }, [assets, cards, dataExists]);

  return (
    <div className={classes.asset}>
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
    </div>
  );
};

export default Asset;
