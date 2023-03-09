import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui';
import classes from './EmojiInput.module.css';
import data from 'emoji_data_kr';
import Picker from '@emoji-mart/react';
import { BiEraser } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';

const EmojiInput = () => {
    const dispatch = useDispatch();

    // Note: 선택한 이모티콘 값 저장 함수
    const changeIconHandler = (emoji: string) => {
        dispatch(uiActions.setTransactionForm({ input: { icon: emoji } }));
    };

    // Note: 이모티콘 팝업창 닫기 함수
    const cancelHandler = () => {
        dispatch(uiActions.setEmojiForm({ isExpand: false }));
    };

    // Note: 선택한 이모티콘 값 삭제 함수
    const deleteIconHandler = () => {
        dispatch(uiActions.setTransactionForm({ input: { icon: '' } }));
    };

    // Note: 이모티콘 클릭 시 동작하는 함수
    const onEmojiClick = (value: any) => {
        const currentEmoji = value.native;

        changeIconHandler(currentEmoji);
        cancelHandler();
    };

    return (
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
    );
};

export default EmojiInput;
