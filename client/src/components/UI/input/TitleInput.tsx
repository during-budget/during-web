import React, { useImperativeHandle, useRef } from 'react';
import classes from './TitleInput.module.css';

const TitleInput = React.forwardRef((props: {}, ref: any) => {
    const titlesRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => {
        return {
            value: getValues,
        };
    });

    const getValues = () => {
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
                <input className={classes.icon} type="text" maxLength={1} />
                <div className={classes.titles} ref={titlesRef}>
                    <input type="text" />
                </div>
            </div>
        </div>
    );
});

export default TitleInput;
