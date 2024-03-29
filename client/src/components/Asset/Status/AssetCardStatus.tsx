import { useState } from 'react';
import { AssetProps } from '../../../screens/Asset';
import Carousel from '../../UI/widget/Carousel';
import AssetCardItemEditor from '../Editor/AssetCardItemEditor';
import AssetCardListEditor from '../Editor/AssetCardListEditor';
import classes from './AssetCardStatus.module.css';
import AssetStatus from './AssetStatus';
import CardStatus from './CardStatus';

const AssetCardStatus = ({ assets, cards }: AssetProps) => {
  const [showListEditor, setShowListEditor] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isAssetEditor, setIsAssetEditor] = useState(true);

  const openListEditor = (payload: { isAsset: boolean }) => {
    setIsAssetEditor(payload.isAsset);
    setShowListEditor(true);
  };

  const closeListEditor = () => {
    setShowListEditor(false);
  };

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
        <AssetStatus
          assets={assets}
          openListEditor={openListEditor}
          openEditor={openEditor}
        />
        <CardStatus
          assets={assets.filter((item) => item.detail === 'account')}
          cards={cards}
          openListEditor={openListEditor}
          openEditor={openEditor}
        />
      </Carousel>
      <AssetCardListEditor
        isOpen={showListEditor}
        closeEditor={closeListEditor}
        isAsset={isAssetEditor}
      />
      <AssetCardItemEditor
        id="status"
        isAsset={isAssetEditor}
        isOpen={showEditor}
        closeEditor={closeEditor}
      />
    </>
  );
};

export default AssetCardStatus;
