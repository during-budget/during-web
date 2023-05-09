import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/redux-hook';
import Amount from '../../../models/Amount';
import { assetActions } from '../../../store/asset';
import {
  AssetDataType,
  CardDataType,
  removeAssetById,
  removeCardById,
  updateAssets,
  updateCards,
} from '../../../util/api/assetAPI';
import DraggableItem from '../../UI/DraggableItem';
import DraggableList from '../../UI/DraggableList';
import Icon from '../../UI/Icon';
import classes from './AssetCardEditItemList.module.css';
import { AssetCardDataType } from './AssetCardListEditor';

interface AssetCardEditItemListProps {
  id: string;
  isAsset: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTarget: (target: AssetCardDataType) => void;
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
    if (confirm('정말 삭제할까요?') === false) return;
    const { assets, paymentMethods, cards } = isAsset
      ? await removeAssetById(id)
      : await removeCardById(id);

    assets && dispatch(assetActions.setAssets(assets));
    paymentMethods && dispatch(assetActions.setPaymentMethods(paymentMethods));
    cards && dispatch(assetActions.setCards(cards));
  };

  const editHandler = async (target: AssetCardDataType) => {
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
                <p className={classes.title}>{item.title}</p>
              </div>
              {amount !== undefined && (
                <p className={classes.amount}>{Amount.getAmountStr(amount)}</p>
              )}
            </div>
          </DraggableItem>
        );
      })}
    </DraggableList>
  );
};

export default AssetCardEditItemList;
