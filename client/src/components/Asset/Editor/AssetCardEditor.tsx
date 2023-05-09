import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { assetActions } from '../../../store/asset';
import {
  AssetDataType,
  CardDataType,
  DetailType,
  createAsset,
  createCard,
  removeAssetById,
  removeCardById,
  updateAssetById,
  updateCardById,
} from '../../../util/api/assetAPI';
import Button from '../../UI/Button';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import EmojiInput from '../../UI/EmojiInput';
import Overlay from '../../UI/Overlay';
import DetailTypeTab from '../UI/DetailTypeTab';
import classes from './AssetCardEditor.module.css';
import { AssetCardDataType } from './AssetCardListEditor';
import AssetFields from './AssetFields';
import CardFields from './CardFields';

interface AssetCardEditorProps {
  isAsset: boolean;
  target?: AssetCardDataType;
  updateTarget?: (target: AssetCardDataType, isAsset?: boolean) => void;
  isOpen: boolean;
  closeEditor: () => void;
  openEditor?: () => void;
  defaultDetail?: DetailType | 'all';
}

const AssetCardEditor = ({
  isAsset,
  target,
  updateTarget,
  isOpen,
  closeEditor,
  openEditor,
  defaultDetail
}: AssetCardEditorProps) => {
  const dispatch = useDispatch();

  const location = useLocation();
  const isInit = location.pathname.includes('/init');

  const [targetState, setTargetState] = useState(target || getDefaultTarget(isAsset));

  useEffect(() => {
    if (isOpen) {
      setTargetState(target || getDefaultTarget(isAsset, defaultDetail));
    }
  }, [isOpen, isAsset, target]);

  /** 자산/카드 수정/생성 정보 제출 */
  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatingTarget = { ...targetState };

    if (!updatingTarget.icon) {
      if (!isAsset) {
        updatingTarget.icon = '💳';
      } else if (updatingTarget.detail === 'cash') {
        updatingTarget.icon = '💵';
      } else {
        updatingTarget.icon = '🏦';
      }
    }

    let assets, cards, payments;

    // 개별 업데이트
    if (isAsset) {
      const updatingAsset = updatingTarget as AssetDataType;
      if (target) {
        const { assets: updatedAssets, paymentMethods: updatedPayments } =
          await updateAssetById(updatingAsset);
        assets = updatedAssets;
        payments = updatedPayments;
      } else {
        const { assets: updatedAssets, paymentMethods: updatedPayments } =
          await createAsset(updatingAsset);
        assets = updatedAssets;
        payments = updatedPayments;
      }
    } else {
      const updatingCard = updatingTarget as CardDataType;
      if (target) {
        const { cards: updatedCards, paymentMethods: updatedPayments } =
          await updateCardById(updatingCard);
        cards = updatedCards;
        payments = updatedPayments;
      } else {
        const { cards: updatedCards, paymentMethods: updatedPayments } = await createCard(
          updatingCard
        );
        cards = updatedCards;
        payments = updatedPayments;
      }
    }

    // 업데이트 상태관리
    assets && dispatch(assetActions.setAssets(assets));
    cards && dispatch(assetActions.setCards(cards));
    payments && dispatch(assetActions.setPaymentMethods(payments));

    // 편집목록에 데이터 전달
    updateTarget && updateTarget(updatingTarget, isAsset);
    closeEditor();
  };

  /** 자산/카드 삭제 */
  const removeHandler = async (id: string) => {
    if (confirm('정말 삭제할까요?') === false) return;
    const { assets, paymentMethods, cards } = isAsset
      ? await removeAssetById(id)
      : await removeCardById(id);

    if (assets) {
      dispatch(assetActions.setAssets(assets));
    }
    if (paymentMethods) {
      dispatch(assetActions.setPaymentMethods(paymentMethods));
    }
    if (cards) {
      dispatch(assetActions.setCards(cards));
    }

    closeEditor();
  };

  /** 자산/카드 정보 업데이트 */
  const setTargetStateProperties = (properties: Partial<AssetCardDataType>) => {
    setTargetState((prev) => {
      return { ...prev, ...properties } as AssetCardDataType;
    });
  };

  /** 아이콘 업데이트 */
  const setIcon = (value: string) => {
    setTargetStateProperties({ icon: value });
  };

  /** 이름 업데이트 */
  const setTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetStateProperties({ title: event.target.value || '' });
  };

  /** 세부 타입 업데이트 */
  const setDetail = (value: DetailType | 'all') => {
    if (value !== 'all') {
      setTargetStateProperties({ detail: value });
    }
  };

  /** 자산 잔액 업데이트 */
  const setAmount = (value: number) => {
    setTargetStateProperties({ amount: value });
  };

  /** 연결 자산 id 업데이트 */
  const setLinkedAssetId = (value: string) => {
    setTargetStateProperties({ linkedAssetId: value });
  };

  return (
    <Overlay
      isOpen={isOpen}
      closeHandler={closeEditor}
      className={`${classes.container} ${isOpen ? classes.open : ''} ${
        isInit ? classes.add : ''
      }`}
    >
      {isInit && (
        <Button className={classes.button} onClick={openEditor}>
          {isAsset ? '자산' : '카드'} 추가하기
        </Button>
      )}
      <div className={classes.content}>
        {target && (
          <div className={classes.remove}>
            <Button
              styleClass="extra"
              onClick={() => {
                removeHandler(target._id);
              }}
            />
          </div>
        )}
        <DetailTypeTab
          id={`${isAsset ? 'asset' : 'card'}-detail-type-tab`}
          isAsset={isAsset}
          detailState={targetState.detail}
          setDetailState={setDetail}
        />
        <form onSubmit={submitHandler} className={classes.form}>
          <div className={classes.data}>
            <EmojiInput
              value={targetState?.icon || ''}
              onChange={setIcon}
              placeholder={isAsset ? (targetState.detail === 'cash' ? '💵' : '🏦') : '💳'}
              style={{
                width: '5rem',
                height: '5rem',
                fontSize: '2.5rem',
                borderRadius: '0.75rem',
              }}
            />
            <input
              className={classes.title}
              value={targetState?.title || ''}
              onChange={setTitle}
              placeholder="이름을 입력하세요"
            />
          </div>
          {isAsset ? (
            <AssetFields
              amount={(targetState as AssetDataType)?.amount || 0}
              setAmount={setAmount}
            />
          ) : (
            <CardFields
              assetId={(targetState as CardDataType)?.linkedAssetId || ''}
              setAssetId={setLinkedAssetId}
            />
          )}
          <ConfirmCancelButtons
            isClose={!isOpen}
            onClose={closeEditor}
            confirmMsg={`${isAsset ? '자산' : '카드'} ${
              target ? '편집 완료' : '추가 완료'
            }`}
          />
        </form>
      </div>
    </Overlay>
  );
};

/** 새로운 예산 생성을 위한 기본 자산/카드 객체 반환 */
const getDefaultTarget = (isAsset: boolean, detail?: DetailType | 'all') => {
  let target;

  if (isAsset) {
    target = { title: '', detail: detail || 'account', amount: 0 };
  } else {
    target = { title: '', detail: detail || 'debit' };
  }

  return target as AssetCardDataType;
};

export default AssetCardEditor;
