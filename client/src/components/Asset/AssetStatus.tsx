import Amount from '../../models/Amount';
import { AssetDataType } from '../../util/api/assetAPI';
import AmountBars from '../Budget/Amount/AmountBars';
import classes from './AssetStatus.module.css';

interface AssetStatusProps {
  assets: AssetDataType[];
}

const AssetStatus = ({ assets }: AssetStatusProps) => {
  const total = assets.reduce((acc, curr) => acc + curr.amount, 0);
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
    </section>
  );
};

export default AssetStatus;
