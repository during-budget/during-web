import { useMemo } from 'react';
import { ASSET_CARD_DETAIL_TYPE } from '../../../constants/type';
import { AssetDetailType, CardDetailType, DetailType } from '../../../util/api/assetAPI';
import RadioTab, { RadioTabValueType } from '../../UI/input/RadioTab';

const ASSET_DEATAIL_TAB: AssetDetailType[] = ['account', 'cash', 'etc'];
const CARD_DEATAIL_TAB: CardDetailType[] = ['debit', 'credit'];

interface DetailTypeTabProps {
  id: string;
  className?: string;
  isAsset: boolean;
  isAll?: boolean;
  detailState: string;
  setDetailState: (value: DetailType | 'all') => void;
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
    const data: ('all' | DetailType)[] = isAsset
      ? [...ASSET_DEATAIL_TAB]
      : [...CARD_DEATAIL_TAB];
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
