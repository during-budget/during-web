import { useState } from 'react';
import { AssetProps } from '../../screens/Asset';
import Carousel from '../UI/Carousel';
import AssetCardListEditor from './AssetCardListEditor';
import classes from './AssetCardStatus.module.css';
import AssetStatus from './AssetStatus';
import CardStatus from './CardStatus';

const AssetCardStatus = ({ assets, cards }: AssetProps) => {
  const [showEditor, setShowEditor] = useState(false);
  const [isAssetEditor, setIsAssetEditor] = useState(true);

  const openEditor = (payload: { isAsset: boolean }) => {
    setIsAssetEditor(payload.isAsset);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
  };

  return (
    <>
      <Carousel id="asset-payment-status" itemClassName={classes.status}>
        <AssetStatus assets={assets} openEditor={openEditor} />
        <CardStatus assets={assets} cards={cards} openEditor={openEditor} />
      </Carousel>
      <AssetCardListEditor
        isOpen={showEditor}
        closeEditor={closeEditor}
        isAsset={isAssetEditor}
        showAll={true}
      />
    </>
  );
};

export default AssetCardStatus;
