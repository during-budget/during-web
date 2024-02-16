import { useEffect } from 'react';
import AdRemove from '../components/Store/AdRemove';
import ChartSkinList from '../components/User/Skin/ChartSkinList';
import { useAppSelector } from '../hooks/useRedux';
import classes from './Store.module.css';
import { useNavigate } from 'react-router';
import { cn } from '../util/cn';

const Store = () => {
  const navigate = useNavigate();

  const platform = useAppSelector((state) => state.ui.platform);
  const showAdRemove = platform;

  useEffect(() => {
    // NOTE: 오버레이를 닫아도 전체 페이지를 리로드하지 않도록 해시를 추가하여 해시 간의 이동으로 간주되도록 처리
    navigate('/store#base', { replace: true });
  }, []);

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
        <h4 className={cn(classes.center, 'text-lm')}>듀링 구매하기</h4>
        <p className={cn(classes.center, 'text-md')}>듀링 캐릭터를 통해 차트를 꾸밀 수 있습니다.</p>
        <ChartSkinList price={platform ? 2300 : 2000} />
      </section>
    </div>
  );
};

export default Store;
