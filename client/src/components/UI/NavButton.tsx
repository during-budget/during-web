import { Link } from 'react-router-dom';

// NOTE: props to가 있을 경우 Link, onClick이 있을 경우 Button, 둘 다 있을 경우 Link
function NavButton(props: {
    to?: string;
    onClick?: (event: React.MouseEvent) => void;
    isNext?: boolean;
    className?: string;
}) {
    const chevron = props.isNext ? '>' : '<';

    const navLink = props.to && (
        <Link className={props.className} to={props.to} onClick={props.onClick}>
            {chevron}
        </Link>
    );

    const navButton = props.onClick && (
        <button type="button" onClick={props.onClick}>
            {chevron}
        </button>
    );

    return navLink || navButton || <></>;
}

export default NavButton;
