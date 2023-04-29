import Amount from '../../models/Amount';
import { AssetProps } from '../../screens/Asset';
import Icon from '../UI/Icon';
import classes from './AssetList.module.css';
import CardList from './CardList';

const AssetList = ({ assets, cards }: AssetProps) => {
  return (
    <section>
      <ul className={classes.list}>
        {assets.map((asset) => {
          const assetCards = cards.filter((card) => card.linkedAssetId === asset._id);
          return (
            <li key={asset._id} className={classes.item}>
              <div className={classes.asset}>
                <div className={classes.info}>
                  <Icon>{asset.icon}</Icon>
                  <div className={classes.titles}>
                    <p className={classes.type}>계좌</p>
                    <p className={classes.title}>{asset.title}</p>
                  </div>
                </div>
                <p className={classes.amount}>{Amount.getAmountStr(asset.amount)}</p>
              </div>
              <CardList className={classes.cards} cards={assetCards} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AssetList;
