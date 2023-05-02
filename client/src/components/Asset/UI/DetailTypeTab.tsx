import { useMemo } from 'react';
import { ASSET_CARD_DETAIL_TYPE, DetailTablValueType } from '../../../constants/type';
import RadioTab, { RadioTabValueType } from '../../UI/RadioTab';

const ASSET_DEATAIL_TAB: DetailTablValueType[] = ['account', 'cash', 'etc'];
const CARD_DEATAIL_TAB: DetailTablValueType[] = ['debit', 'credit'];

interface DetailTypeTabProps {
  id: string;
  className?: string;
  isAsset: boolean;
  isAll?: boolean;
  detailState: string;
  setDetailState: React.Dispatch<React.SetStateAction<DetailTablValueType>>;
}

const DetailTypeTab = ({
  id,
  className,
  isAsset,
  isAll,
  detailState,
  setDetailState,
}: DetailTypeTabProps) => {
  // Set tab data
  const tabData = useMemo(() => {
    const data = isAsset ? [...ASSET_DEATAIL_TAB] : [...CARD_DEATAIL_TAB];
    if (isAll) {
      data.unshift('all');
    }
    return data;
  }, [isAsset, isAll]);

  const tabs: RadioTabValueType[] = tabData.map((item) => {
    return {
      label: ASSET_CARD_DETAIL_TYPE[item],
      value: item,
      checked: detailState === item,
      onChange: () => {
        setDetailState(item);
      },
    };
  });

  return <RadioTab name={id} values={tabs} className={className} />;
};

export default DetailTypeTab;
