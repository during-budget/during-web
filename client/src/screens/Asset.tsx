import AssetCardStatus from '../components/Asset/AssetCardStatus';
import AssetList from '../components/Asset/AssetList';
import { useAppSelector } from '../hooks/redux-hook';
import { AssetDataType, CardDataType } from '../util/api/assetAPI';
import classes from './Asset.module.css';

export interface AssetProps {
  assets: AssetDataType[];
  cards: CardDataType[];
}

const Asset = () => {
  const { assets, cards } = useAppSelector((state) => state.asset);

  return (
    <>
      <header className={classes.header}>
        <h1>자산 및 결제수단</h1>
      </header>
      <main>
        <AssetCardStatus assets={assets} cards={cards} />
        <hr />
        <AssetList assets={assets} cards={cards} />
      </main>
    </>
  );
};

export default Asset;
