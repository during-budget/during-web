import { useState } from 'react';
import classes from './OptionButton.module.css';
import { css } from '@emotion/react';

function OptionButton(props: {
  menu: { name: string; action: () => void }[];
  onSelect?: () => void;
  className?: string;
  contextStyle?: React.CSSProperties;
  disabled?: boolean;
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
      className="fixed position-0 z-5"
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        setIsShowMenu(false);
      }}
    ></div>
  );

  const contextStyle = css({
    top: '1.65rem',
    minWidth: '10rem',
    '& li:hover': {
        backgroundColor: 'var(--gray-100)'
    }
  });

  const contextMenu = (
    <ul
      className="absolute right-0 text-left round-md p-0.5 z-10 bg-white shadow-0.2"
      css={{ ...contextStyle, ...props.contextStyle }}
    >
      {props.menu.map((item) => {
        const { name, action } = item;
        return (
          <li
            key={name}
            onClick={clickHandler(action)}
            className="p-0.5 round-md pointer"
          >
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
        className={`relative ${props.className}`}
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
        }}
      >
        <button
          className="w-100 h-100 text-right text-inherit extra-bold"
          onClick={() => {
            setIsShowMenu(true);
          }}
          disabled={props.disabled}
        >
          ・・・
        </button>
        {isShowMenu && contextMenu}
      </div>
    </>
  );
}

export default OptionButton;
