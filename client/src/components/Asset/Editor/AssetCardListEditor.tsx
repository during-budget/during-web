import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { ASSET_CARD_DETAIL_TYPE } from '../../../constants/type';
import { useAppSelector } from '../../../hooks/useRedux';
import { assetActions } from '../../../store/asset';
import {
  AssetDataType,
  CardDataType,
  DetailType,
  updateAssets,
  updateCards,
} from '../../../util/api/assetAPI';
import Button from '../../UI/button/Button';
import DraggableItem from '../../UI/draggable/DraggableItem';
import DraggableList from '../../UI/draggable/DraggableList';
import Icon from '../../UI/component/Icon';
import OverlayForm from '../../UI/overlay/OverlayForm';
import DetailTypeTab from '../UI/DetailTypeTab';
import AssetCardItemEditor from './AssetCardItemEditor';
import classes from './AssetCardListEditor.module.css';
interface AssetCardListEditorProps {
  isAsset: boolean;
  isOpen: boolean;
  closeEditor: () => void;
}

export type AssetCardDataType = AssetDataType | CardDataType;

const AssetCardListEditor = ({
  isAsset,
  isOpen,
  closeEditor,
}: AssetCardListEditorProps) => {
  const dispatch = useDispatch();

  const list: AssetCardDataType[] = useAppSelector((state) =>
    isAsset ? state.asset.assets : state.asset.cards
  );

  const [detailState, setDetailState] = useState<DetailType | 'all'>('all');
  const [listState, setListState] = useState(list);
  const [showEditor, setShowEditor] = useState(false);
  const [itemEditorData, setItemEditorData] = useState<{
    isOpen: boolean;
    target: AssetCardDataType | null;
  }>({ isOpen: false, target: null });

  // Set detail state
  useEffect(() => {
    if (isOpen) {
      setDetailState('all');
      setListState(list);
    }
  }, [isOpen]);

  useEffect(() => {
    setListState(list);
  }, [list]);

  // Set list data
  useEffect(() => {
    setListState(list);
  }, [isAsset]);

  /** 자산/카드 목록 수정사항 제출 */
  const submitHandler = async () => {
    if (isAsset) {
      const { assets, paymentMethods } = await updateAssets(listState as AssetDataType[]);
      assets && dispatch(assetActions.setAssets(assets));
      paymentMethods && dispatch(assetActions.setPaymentMethods(paymentMethods));
    } else {
      const { cards, paymentMethods } = await updateCards(listState as CardDataType[]);
      cards && dispatch(assetActions.setCards(cards));
      paymentMethods && dispatch(assetActions.setPaymentMethods(paymentMethods));
    }

    closeEditor();
  };

  /** 해당 자산/카드 편집 오버레이 열기 */
  const openEditHandler = (idx: number, id?: string) => {
    const target = listState.find((item) => item._id === id || item.id === id) || null;
    setItemEditorData({ isOpen: true, target });
  };

  const openAddHandler = () => {
    setItemEditorData({ isOpen: true, target: null });
  };

  useEffect(() => {
    if (itemEditorData.isOpen) {
      setShowEditor(true);
    } else {
      setShowEditor(false);
    }
  }, [itemEditorData.isOpen]);

  const closeItemEditorHandler = () => {
    setItemEditorData({ isOpen: false, target: null });
  };

  /** 해당 자산/카드 삭제하여 paymentState에 반영 */
  const removeHandler = (_: number, id?: string) => {
    setListState((prev) => {
      const idx = prev.findIndex((item) => item._id === id || item.id === id);
      if (idx === -1) {
        return prev;
      } else {
        return [...prev.slice(0, idx), ...prev.slice(idx + 1, prev.length)];
      }
    });
  };

  /** 자산/카드 편집 내용 기반 리스트 업데이트 */
  const setUpdatedList = (target: AssetCardDataType) => {
    setListState((prev) => {
      const next = [...prev];
      const idx = prev.findIndex((item) => {
        return target._id === undefined ? item.id === target.id : item._id === target._id;
      });

      if (idx === -1) {
        next.push(target);
      } else {
        next[idx] = target;
      }
      return next;
    });
  };

  const getItemEditorDetailState = () => {
    if (detailState === 'all') {
      return isAsset ? 'account' : 'credit';
    } else {
      return detailState;
    }
  };

  return (
    <>
      <OverlayForm
        onSubmit={submitHandler}
        overlayOptions={{
          id: 'asset-card-list-editor',
          isOpen,
          onClose: closeEditor,
          noTransform: true,
        }}
        formPadding="lg"
        className={classes.container}
      >
        <h2>{isAsset ? '자산' : '카드'} 편집</h2>
        <DetailTypeTab
          id={isAsset ? 'asset-list-detail-type-tab' : 'card-list-detail-type-tab'}
          className={classes.tab}
          isAsset={isAsset}
          isAll={true}
          detailState={detailState}
          setDetailState={setDetailState}
        />
        <DraggableList
          id="payment-editor-list"
          list={listState}
          setList={setListState}
          className={classes.list}
        >
          {/* TODO: filter by item.type */}
          {listState
            .filter((item) => detailState === 'all' || item.detail === detailState)
            .map((item, i) => (
              <DraggableItem
                key={item._id || item.id}
                id={item._id || item.id || uuid()}
                idx={i}
                onEdit={openEditHandler}
                onRemove={removeHandler}
                preventDrag={detailState !== 'all'}
              >
                <div className={classes.data}>
                  <Icon className={classes.icon} isSquare={true}>
                    {item.icon}
                  </Icon>
                  <div className={classes.info}>
                    <span className="text-sm">
                      {ASSET_CARD_DETAIL_TYPE[item.detail]}
                    </span>
                    <span className={classes.title}>{item.title}</span>
                  </div>
                </div>
              </DraggableItem>
            ))}
        </DraggableList>
        <Button className={classes.add} styleClass="extra" onClick={openAddHandler}>
          {isAsset ? '자산 ' : '카드 '} 추가하기
        </Button>
      </OverlayForm>
      <AssetCardItemEditor
        id="edit"
        isAsset={isAsset}
        defaultDetail={detailState === 'all' ? undefined : detailState}
        target={itemEditorData.target ? itemEditorData.target : undefined}
        updateTarget={setUpdatedList}
        isOpen={showEditor}
        closeEditor={closeItemEditorHandler}
        preventSubmit={true}
      />
    </>
  );
};

export default AssetCardListEditor;
