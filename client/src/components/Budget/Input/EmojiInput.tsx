import React, { useImperativeHandle, useRef, useState } from 'react';
import classes from './EmojiInput.module.css';
import data from 'emoji_data_kr';
import Picker from '@emoji-mart/react';
import { BiEraser } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';
import Overlay from '../../UI/Overlay';

const EmojiInput = React.forwardRef(
    (
        props: {
            className?: string;
            value?: string;
            defaultValue?: string;
            onChange?: (value: string) => void;
            placeholder?: string;
            required?: boolean;
            isDark?: boolean;
        },
        ref
    ) => {
        useImperativeHandle(ref, () => {
            return {
                value: () => iconRef.current!.value,
            };
        });

        const iconRef = useRef<HTMLInputElement>(null);
        const [open, setOpen] = useState(false);

        // NOTE: 이모티콘 팝업창 닫기 함수
        const cancelHandler = () => {
            setOpen(false);
        };

        // NOTE: 선택한 이모티콘 값 삭제 함수
        const deleteIconHandler = () => {
            iconRef.current!.value = '';
            setOpen(false);
        };

        // NOTE: 이모티콘 클릭 시 동작하는 함수
        const onEmojiClick = (value: any) => {
            iconRef.current!.value = value.native;
            props.onChange && props.onChange(value.native);
            cancelHandler();
        };

        // NOTE : 이모지 팝업 오픈 함수
        const handleEmojiPopup = () => {
            setOpen(!open);
        };

        return (
            <div className={props.className}>
                <input
                    ref={iconRef}
                    className={`${classes.icon} ${
                        props.isDark ? classes.dark : ''
                    }`}
                    type="text"
                    placeholder={props.placeholder}
                    maxLength={2}
                    onClick={handleEmojiPopup}
                    onChange={() => {}} // NOTE: for remove warning
                    value={props.value}
                    defaultValue={props.defaultValue}
                    required={props.required}
                />
                <Overlay
                    className={classes.overlay}
                    isOpen={open}
                    isShowBackdrop={true}
                    closeHandler={cancelHandler}
                >
                    <div className={classes.header}>
                        <BiEraser
                            className={classes.icon}
                            onClick={deleteIconHandler}
                        />
                        <MdOutlineCancel
                            className={classes.icon}
                            onClick={cancelHandler}
                        />
                    </div>
                    <Picker
                        data={data}
                        locale="kr"
                        onEmojiSelect={onEmojiClick}
                        navPosition="bottom"
                        previewPosition="none"
                        skinTonePosition="search"
                        dynamicWidth={true}
                    />
                </Overlay>
            </div>
        );
    }
);

export default EmojiInput;
