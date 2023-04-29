import { AssetDataType, CardDataType } from '../../util/api/assetAPI';

interface AssetListProps {
  assets: AssetDataType[];
  cards: CardDataType[];
}

const AssetList = ({ assets, cards }: AssetListProps) => {
  return (
    <section>
      <ul>
        {assets.map((asset) => {
          return (
            <li key={asset._id}>
              <p>
                {asset.icon} {asset.title}
              </p>
              <p>{asset.amount}</p>
              <p>
                {cards.map((card) => {
                  if (card.linkedAssetId === asset._id) {
                    return (
                      <span key={card._id}>
                        {card.icon} {card.title}
                      </span>
                    );
                  }
                })}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AssetList;
