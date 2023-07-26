import AdRemove from '../components/Store/AdRemove';
import ChartSkinList from '../components/User/Skin/ChartSkinList';
import { useAppSelector } from '../hooks/redux-hook';
import classes from './Store.module.css';

const Store = () => {
  const platform = useAppSelector((state) => state.ui.platform);
  const showAdRemove = platform;
  return (
    <div className={classes.store}>
      <div className={classes.header}>
        <img className={classes.logo} src="/images/logo.png" alt="듀링 가계부 로고" />
        <h3>구매하기</h3>
      </div>
      {showAdRemove && (
        <section className={classes.full}>
          <AdRemove price={platform ? 6900 : 6000} />
        </section>
      )}
      <section className={showAdRemove ? '' : classes.marginTop}>
        <h4 className={classes.center}>듀링 구매하기</h4>
        <p className={classes.center}>듀링 캐릭터를 통해 차트를 꾸밀 수 있습니다.</p>
        <ChartSkinList price={platform ? 2300 : 2000} />
      </section>
    </div>
  );
};

export default Store;
