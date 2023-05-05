import { useMemo } from 'react';
import Amount from '../../../models/Amount';
import { AssetDataType } from '../../../util/api/assetAPI';
import AmountBars from '../../Budget/Amount/AmountBars';
import EditButton from '../../UI/EditButton';
import classes from './AssetStatus.module.css';

interface AssetStatusProps {
  assets: AssetDataType[];
  openEditor?: (payload: { isAsset: boolean }) => void;
}

const AssetStatus = ({ assets, openEditor }: AssetStatusProps) => {
  const total = useMemo(
    () => assets.reduce((acc, curr) => acc + curr.amount, 0),
    [assets]
  );

  return (
    <section className={classes.container}>
      <h6>총자산</h6>
      <p className={classes.total}>{Amount.getAmountStr(total)}</p>
      <AmountBars
        className={classes.bars}
        borderRadius="0.4rem"
        amountData={assets.map((asset) => {
          return {
            label: asset.icon,
            amount: asset.amount,
          };
        })}
      />
      {openEditor && (
        <EditButton
          label="자산 편집"
          onClick={openEditor.bind(null, { isAsset: true })}
        />
      )}
    </section>
  );
};

export default AssetStatus;
