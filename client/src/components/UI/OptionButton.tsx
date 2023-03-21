import { useState } from 'react';
import classes from './OptionButton.module.css';

function OptionButton(props: {
    menu: { name: string; action: () => void }[];
    onSelect?: () => void;
    className?: string;
    contextStyle?: any;
}) {
    const [isShowMenu, setIsShowMenu] = useState(false);

    const clickHandler = (action: () => void) => {
        return () => {
            setIsShowMenu(false);
            props.onSelect && props.onSelect();
            action();
        };
    };

    const outside = (
        <div
            className={classes.outside}
            onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                setIsShowMenu(false);
            }}
        ></div>
    );

    const contextMenu = (
        <ul className={classes.context} style={props.contextStyle}>
            {props.menu.map((item) => {
                const { name, action } = item;
                return (
                    <li key={name} onClick={clickHandler(action)}>
                        {name}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <>
            {isShowMenu && outside}
            <div
                className={`${classes.option} ${props.className}`}
                onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                }}
            >
                <button
                    className={classes.button}
                    onClick={() => {
                        setIsShowMenu(true);
                    }}
                >
                    ・・・
                </button>
                {isShowMenu && contextMenu}
            </div>
        </>
    );
}

export default OptionButton;
