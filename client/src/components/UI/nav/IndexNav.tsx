import { Link } from 'react-router-dom';
import NavButton from '../button/NavButton';

interface IndexNavProps {
  idx?: number;
  setIdx?: (param: any) => void;
  data?: any[];
  title?: string;
  to?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

function IndexNav({ idx, setIdx, data, title, to, onNext, onPrev }: IndexNavProps) {
  const lastIdx = data ? data.length - 1 : 0;

  const plusIdx = () => {
    setIdx &&
      setIdx((prevIdx: any) => {
        const nextIdx = prevIdx === lastIdx ? 0 : prevIdx + 1;
        return nextIdx;
      });
    onNext && onNext();
  };

  const minusIdx = () => {
    setIdx &&
      setIdx((prevIdx: any) => {
        const nextIdx = prevIdx === 0 ? lastIdx : prevIdx - 1;
        return nextIdx;
      });
    onPrev && onPrev();
  };

  const label = data ? data[idx || 0] : title ? title : '';

  return (
    <div className="w-100 p-0.5 mt-1 round-lg bg-gray-0 text-center flex j-between i-center text-xl semi-bold">
      <NavButton onClick={minusIdx} isNext={false} />
      {to ? <Link to={to}>{label}</Link> : <div>{label}</div>}
      <NavButton onClick={plusIdx} isNext={true} />
    </div>
  );
}

export default IndexNav;
