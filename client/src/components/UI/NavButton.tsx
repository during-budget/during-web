import { Link } from 'react-router-dom';

// NOTE: props to가 있을 경우 Link, onClick이 있을 경우 Button, 둘 다 있을 경우 Link
function NavButton(props: {
    to?: string;
    onClick?: (event: React.MouseEvent) => void;
    isNext?: boolean;
    className?: string;
}) {
    const direction = props.isNext ? 'right' : 'left';
    const icon = <i className={`fa-solid fa-chevron-${direction}`}></i>;

    const navLink = props.to && (
        <Link className={props.className} to={props.to} onClick={props.onClick}>
            {icon}
        </Link>
    );

    const navButton = props.onClick && (
        <button type="button" onClick={props.onClick}>
            {icon}
        </button>
    );

    return navLink || navButton || <></>;
}

export default NavButton;
