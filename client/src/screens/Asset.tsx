import AssetList from '../components/Asset/AssetList';
import AssetStatus from '../components/Asset/AssetStatus';
import PaymentStatus from '../components/Asset/PaymentStatus';
import Carousel from '../components/UI/Carousel';
import classes from './Asset.module.css';

const Asset = () => {
  return (
    <>
      <header className={classes.header}>
        <h1>자산 및 결제수단</h1>
      </header>
      <main>
        <Carousel id="asset-payment-status" itemClassName={classes.status}>
          <AssetStatus />
          <PaymentStatus />
        </Carousel>
        <hr />
        <AssetList />
      </main>
    </>
  );
};

export default Asset;
