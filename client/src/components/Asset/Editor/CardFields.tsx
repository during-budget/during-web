import { useAppSelector } from '../../../hooks/redux-hook';
import Select from '../../UI/Select';
import classes from './CardFields.module.css';

interface CardFieldsProps {
  assetId?: string;
  setAssetId?: (value: string) => void;
}

const CardFields = ({ assetId, setAssetId }: CardFieldsProps) => {
  const assets = useAppSelector((state) => state.asset.assets);

  console.log('field', assets.find((item) => item._id === assetId)?.title);

  const data = assets.map((item) => {
    return {
      value: item._id,
      label: item.title,
    };
  });

  const changeHandler = (value?: string) => {
    setAssetId && setAssetId(value!);
  };

  return (
    <Select
      className={classes.select}
      data={data}
      value={assetId}
      onChange={changeHandler}
    />
  );
};

export default CardFields;
