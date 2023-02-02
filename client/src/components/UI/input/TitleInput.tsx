import React, { useImperativeHandle, useRef, useState } from 'react';
import classes from './TitleInput.module.css';

const keyUpHandler = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    target.style.width = target.value.length + 'rem';
};

const TitleInput = React.forwardRef(
    (props: { defaultIcon: string; defaultTitle: string[] }, ref: any) => {
        const addInputHandler = () => {
            const id = +new Date() + '';
            setInputsState((prevState) => {
                return [
                    ...prevState,
                    <div key={id} id={id} className={classes.inputWrapper}>
                        <input type="text" onKeyUp={keyUpHandler} autoFocus />
                        <button type="button" onClick={removeInputHandler}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                        <span> | </span>
                    </div>,
                ];
            });
        };

        const removeInputHandler = (event: React.MouseEvent) => {
            const eventTarget = event.target as HTMLButtonElement;
            const targetNode = eventTarget.parentNode!.parentElement!;
            setInputsState((prevState) => {
                return prevState.filter((item: any) => {
                    return item.props.id !== targetNode!.id;
                });
            });
        };

        const titles = props.defaultTitle || [''];
        const titleDivs = titles.map((item: any) => {
            return (
                <div key={item} id={item} className={classes.inputWrapper}>
                    <input
                        type="text"
                        defaultValue={item}
                        style={{ width: item.length + 'rem' }}
                        onKeyUp={keyUpHandler}
                    />
                    <button type="button" onClick={removeInputHandler}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                    <span> | </span>
                </div>
            );
        });

        const [inputsState, setInputsState] = useState(titleDivs);

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
            titlesRef.current!.childNodes.forEach((wrapper: any) => {
                if (wrapper.className === classes.inputWrapper) {
                    const input = wrapper.childNodes[0];
                    titles.push(input.value);
                }
            });
            return titles;
        };

        return (
            <div className="input-field">
                <label>내용</label>
                <div className={classes.inputs}>
                    <input
                        ref={iconRef}
                        className={classes.icon}
                        type="text"
                        placeholder="💰"
                        maxLength={2}
                        defaultValue={props.defaultIcon}
                    />
                    <div ref={titlesRef} className={classes.titles}>
                        {inputsState}
                        <button type="button" onClick={addInputHandler}>
                            +
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

export default TitleInput;
