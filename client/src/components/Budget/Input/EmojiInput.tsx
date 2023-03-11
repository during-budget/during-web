import { useRef, useState } from 'react';
import classes from './EmojiInput.module.css';
import data from 'emoji_data_kr';
import Picker from '@emoji-mart/react';
import { BiEraser } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';

const EmojiInput = (props: {id: string, className?: string}) => {
    const [open, setOpen] = useState(false);

    const iconRef = useRef<HTMLInputElement>(null);

    // Note: 이모티콘 팝업창 닫기 함수
    const cancelHandler = () => {
        setOpen(false);
    };

    // Note: 선택한 이모티콘 값 삭제 함수
    const deleteIconHandler = () => {
        iconRef.current!.value = "";
    };

    // Note: 이모티콘 클릭 시 동작하는 함수
    const onEmojiClick = (value: any) => {
        iconRef.current!.value = value.native;
        cancelHandler();
    };

    // Note : 이모지 팝업 오픈 함수
    const handleEmojiPopup = () => {
        setOpen(!open);
    };

    return (
        <div className={props.className}>
            <input
                ref={iconRef}
                className={classes.icon}
                type='text'
                placeholder='💰'
                maxLength={2}
                onClick={handleEmojiPopup}
            />
            {open ? (
                <div className={classes.overlay}>
                    <div className={classes.header}>
                        <BiEraser
                            className={classes.icons}
                            onClick={deleteIconHandler}
                        />
                        <MdOutlineCancel
                            className={classes.icons}
                            onClick={cancelHandler}
                        />
                    </div>
                    <Picker
                        data={data}
                        locale='kr'
                        onEmojiSelect={onEmojiClick}
                        navPosition='bottom'
                        previewPosition='none'
                        skinTonePosition='none'
                        dynamicWidth='true'
                    />
                </div>
            ) : null}
        </div>
    );
};

export default EmojiInput;
