import { useMemo } from 'react';
import Amount from '../../../models/Amount';
import { AssetDataType } from '../../../util/api/assetAPI';
import AmountArea from '../../Budget/Amount/AmountArea';
import EditButton from '../../UI/button/EditButton';
import Inform from '../../UI/Inform';
import classes from './AssetStatus.module.css';

interface AssetStatusProps {
  assets: AssetDataType[];
  openListEditor?: (payload: { isAsset: boolean }) => void;
  openEditor?: (payload: { isAsset: boolean }) => void;
}

const AssetStatus = ({ assets, openEditor, openListEditor }: AssetStatusProps) => {
  const total = useMemo(
    () => assets.reduce((acc, curr) => acc + curr.amount, 0),
    [assets]
  );

  return (
    <section className={classes.container}>
      <h6>총자산</h6>
      <p className={classes.total}>{Amount.getAmountStr(total)}</p>
      {assets.length === 0 ? (
        <div onClick={openEditor && openEditor.bind(undefined, { isAsset: true })}>
          <Inform isError={false} className={classes.inform}>
            계좌, 현금 등 현재 보유하고 있는 자산을 등록해주세요
          </Inform>
        </div>
      ) : (
        <AmountArea
          className={classes.bars}
          borderRadius="0.4rem"
          amountData={assets.map((asset) => {
            return {
              label: asset.icon || ' ',
              amount: asset.amount,
            };
          })}
        />
      )}
      <div className={classes.buttons}>
        {openListEditor && (
          <EditButton
            label="자산 편집"
            onClick={openListEditor.bind(undefined, { isAsset: true })}
          />
        )}
        {openEditor && (
          <EditButton
            label="자산 추가"
            icon="plus"
            onClick={openEditor.bind(null, { isAsset: true })}
          />
        )}
      </div>
    </section>
  );
};

export default AssetStatus;
