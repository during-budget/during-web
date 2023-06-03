import { useAppSelector } from '../../../hooks/redux-hook';
import classes from './CardFields.module.css';

interface CardFieldsProps {
  assetId?: string;
  setAssetId?: (value: string) => void;
  className?: string;
}

const CardFields = ({ assetId, setAssetId, className }: CardFieldsProps) => {
  const assets = useAppSelector((state) => state.asset.assets);

  const data = assets.map((item) => {
    return {
      value: item._id,
      label: item.title,
    };
  });

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAssetId && setAssetId(event.target.value);
  };

  return (
    <select
      className={`${classes.select} ${className || ''}`}
      value={assetId}
      onChange={changeHandler}
    >
      <option>연결 계좌 없음</option>
      {data.map((item, i) => (
        <option key={i} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default CardFields;
