import { useEffect, useState } from 'react';
import { AssetDataType, CardDataType, DetailType } from '../../../util/api/assetAPI';
import EmojiInput from '../../Budget/Input/EmojiInput';
import Button from '../../UI/Button';
import ConfirmCancelButtons from '../../UI/ConfirmCancelButtons';
import Overlay from '../../UI/Overlay';
import DetailTypeTab from '../UI/DetailTypeTab';
import classes from './AssetCardEditor.module.css';
import { AssetCardDataType } from './AssetCardListEditor';
import AssetFields from './AssetFields';
import CardFields from './CardFields';

interface AssetCardEditorProps {
  isAsset: boolean;
  target?: AssetCardDataType;
  updateTarget?: (target: AssetCardDataType) => void;
  isOpen: boolean;
  closeEditor: () => void;
}

const AssetCardEditor = ({
  isAsset,
  target,
  updateTarget,
  isOpen,
  closeEditor,
}: AssetCardEditorProps) => {
  const [targetState, setTargetState] = useState(target || getDefaultTarget(isAsset));

  useEffect(() => {
    if (isOpen) {
      setTargetState(target || getDefaultTarget(isAsset));
    }
  }, [isOpen, isAsset, target]);

  /** 자산/카드 수정/생성 정보 제출 */
  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const updatingTarget = { ...targetState };

    if (!updatingTarget.icon && updatingTarget.detail === 'cash') {
      updatingTarget.icon = '💵';
    } else {
      updatingTarget.icon = '🏦';
    }

    updateTarget && updateTarget(updatingTarget);
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
    <Overlay isOpen={isOpen} closeHandler={closeEditor} className={classes.container}>
      <div className={classes.content}>
        {target && (
          <Button styleClass="extra" className={classes.remove}>
            삭제
          </Button>
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
              placeholder={targetState.detail === 'cash' ? '💵' : '🏦'}
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
            onClose={closeEditor}
            confirmMsg={`${isAsset ? '자산' : '카드'} 편집 완료`}
          />
        </form>
      </div>
    </Overlay>
  );
};

/** 새로운 예산 생성을 위한 기본 자산/카드 객체 반환 */
const getDefaultTarget = (isAsset: boolean) => {
  let target;

  if (isAsset) {
    target = { title: '', detail: 'account', amount: 0 };
  } else {
    target = { title: '', detail: 'debit' };
  }

  return target as AssetCardDataType;
};

const getDefaultIcon = (isAsset: boolean, target?: AssetCardDataType) => {
  return isAsset ? (target?.detail === 'cash' ? '💵' : '🏦') : '🏦';
};

export default AssetCardEditor;
