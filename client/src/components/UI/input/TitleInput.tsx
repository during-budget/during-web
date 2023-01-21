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
                    <input type="text" />
                </div>
            </div>
        </div>
    );
});

export default TitleInput;
