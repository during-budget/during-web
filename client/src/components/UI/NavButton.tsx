import { Link } from 'react-router-dom';

// NOTE: props to가 있을 경우 Link, onClick이 있을 경우 Button, 둘 다 있을 경우 Link
interface NavButtonProps {
  to?: string;
  onClick?: (event: React.MouseEvent) => void;
  isNext?: boolean;
  className?: string;
  content?: string;
}

const NavButton = ({ to, onClick, isNext, className, content }: NavButtonProps) => {
  const chevron = isNext ? '>' : '<';

  const navLink = to && (
    <Link className={className} to={to} onClick={onClick}>
      {chevron}
    </Link>
  );

  const navButton = onClick && (
    <button className={className} type="button" onClick={onClick}>
      {content ? content : chevron}
    </button>
  );

  return navLink || navButton || <></>;
};

export default NavButton;
