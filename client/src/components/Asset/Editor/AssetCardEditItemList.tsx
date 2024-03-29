import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/useRedux';
import Amount from '../../../models/Amount';
import { assetActions } from '../../../store/asset';
import { uiActions } from '../../../store/ui';
import {
  AssetDataType,
  CardDataType,
  removeAssetById,
  removeCardById,
  updateAssets,
  updateCards,
} from '../../../util/api/assetAPI';
import { getErrorMessage } from '../../../util/error';
import DraggableItem from '../../UI/draggable/DraggableItem';
import DraggableList from '../../UI/draggable/DraggableList';
import Icon from '../../UI/component/Icon';
import classes from './AssetCardEditItemList.module.css';
import { AssetCardDataType } from './AssetCardListEditor';

interface AssetCardEditItemListProps {
  id: string;
  isAsset: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTarget: (target?: AssetCardDataType) => void;
}

const AssetCardEditItemList = ({
  id,
  isAsset,
  setOpen,
  setTarget,
}: AssetCardEditItemListProps) => {
  const dispatch = useDispatch();

  const list = useAppSelector((state) => state.asset[isAsset ? 'assets' : 'cards']);
  const setList = (list: any[]) => {
    if (isAsset) {
      dispatch(assetActions.setAssets(list));
    } else {
      dispatch(assetActions.setCards(list));
    }
  };

  const removeHandler = async (id: string) => {
    dispatch(
      uiActions.showModal({
        title: `${isAsset ? '자산을' : '카드를'} 삭제할까요?`,
        description: '모든 정보가 삭제되며 복구할 수 없습니다.',
        onConfirm: async () => {
          try {
            const { assets, paymentMethods, cards } = isAsset
              ? await removeAssetById(id)
              : await removeCardById(id);

            assets && dispatch(assetActions.setAssets(assets));
            paymentMethods && dispatch(assetActions.setPaymentMethods(paymentMethods));
            cards && dispatch(assetActions.setCards(cards));
          } catch (error) {
            const message = getErrorMessage(error);
            dispatch(
              uiActions.showErrorModal({
                description: message || '삭제 처리 중 문제가 발생했습니다.',
              })
            );
            if (!message) throw error;
          }
        },
      })
    );
  };

  const editHandler = async (target?: AssetCardDataType) => {
    await setTarget(target);
    setOpen(true);
  };

  const sortHandler = async (list: any[]) => {
    if (isAsset) {
      const { assets } = await updateAssets(list as AssetDataType[]);
      dispatch(assetActions.setAssets(assets));
    } else {
      const { cards } = await updateCards(list as CardDataType[]);
      dispatch(assetActions.setCards(cards));
    }
  };

  return (
    <DraggableList
      id={id}
      className={classes.list}
      list={list}
      setList={setList}
      onDragEnd={sortHandler}
    >
      {list.map((item, i) => {
        const amount = (item as AssetDataType).amount;

        return (
          <DraggableItem
            key={item._id}
            id={item._id}
            idx={i}
            onRemove={() => {
              removeHandler(item._id);
            }}
            onEdit={() => {
              editHandler(item);
            }}
          >
            <div className={classes.data}>
              <div className={classes.head}>
                <Icon>{item.icon}</Icon>
                <div>
                  <p className={classes.title}>{item.title}</p>
                  {amount !== undefined && (
                    <p className={classes.amount}>{Amount.getAmountStr(amount)}</p>
                  )}
                </div>
              </div>
            </div>
          </DraggableItem>
        );
      })}
    </DraggableList>
  );
};

export default AssetCardEditItemList;
