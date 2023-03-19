import { useState } from 'react';
import classes from './OptionButton.module.css';

function OptionButton(props: {
    menu: { name: string; action: () => void }[];
    className?: string;
}) {
    const [isShowMenu, setIsShowMenu] = useState(false);

    const clickHandler = (action: () => void) => {
        return () => {
            setIsShowMenu(false);
            action();
        };
    };

    const outside = (
        <div
            className={classes.outside}
            onClick={() => {
                setIsShowMenu(false);
            }}
        ></div>
    );

    const contextMenu = (
        <ul className={classes.context}>
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
            <div className={`${classes.option} ${props.className}`}>
                <button
                    className={classes.button}
                    onClick={() => {
                        setIsShowMenu(true);
                    }}
                >
                    …
                </button>
                {isShowMenu && contextMenu}
            </div>
        </>
    );
}

export default OptionButton;
