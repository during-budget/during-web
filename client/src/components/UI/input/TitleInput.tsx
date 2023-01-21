import React, { useImperativeHandle, useRef } from 'react';
import classes from './TitleInput.module.css';

const TitleInput = React.forwardRef((props: {}, ref: any) => {
    const iconRef = useRef<HTMLInputElement>(null);
    const titlesRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => {
        return {
            icon: getIcon,
            value: getTitles,
        };
    });

    const getIcon = () => {
        return iconRef.current!.value;
    };

    const getTitles = () => {
        const titles: string[] = [];
        titlesRef.current!.childNodes.forEach((item: any) => {
            if (item.nodeName === 'INPUT') {
                titles.push(item.value);
            }
        });
        return titles;
    };

    const keyUpHandler = (event: React.KeyboardEvent) => {
        const target = event.target as HTMLInputElement;
        target.style.width = target.value.length + 'rem';
    };

    return (
        <div className="input-field">
            <label>제목</label>
            <div className={classes.inputs}>
                <input
                    ref={iconRef}
                    className={classes.icon}
                    type="text"
                    maxLength={2}
                />
                <div ref={titlesRef} className={classes.titles}>
                    <input type="text" onKeyUp={keyUpHandler} />
                    <span> | </span>
                    <button type="button">+</button>
                </div>
            </div>
        </div>
    );
});

export default TitleInput;
