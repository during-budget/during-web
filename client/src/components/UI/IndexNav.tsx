import classes from './IndexNav.module.css';
import NavButton from './NavButton';

interface IndexNavProps {
  idx?: number;
  setIdx?: (param: any) => void;
  data?: any[];
  title?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

function IndexNav({ idx, setIdx, data, title, onNext, onPrev }: IndexNavProps) {
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
    <div className={classes.container}>
      <NavButton onClick={minusIdx} isNext={false} />
      <div>{label}</div>
      <NavButton onClick={plusIdx} isNext={true} />
    </div>
  );
}

export default IndexNav;
