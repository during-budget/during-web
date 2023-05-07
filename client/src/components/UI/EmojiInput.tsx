import React, { CSSProperties, useImperativeHandle, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../store/ui';
import classes from './EmojiInput.module.css';

interface EmojiInputProps {
  id?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  onClick?: () => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  isDark?: boolean;
  style?: CSSProperties;
}

const EmojiInput = React.forwardRef((props: EmojiInputProps, ref) => {
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => {
    return {
      value: () => iconRef.current!.value,
    };
  });

  //   const id = `emoji-input-${props.id}`;
  const iconRef = useRef<HTMLInputElement>(null);

  /** 이모지 선택 */
  const selectHandler = (value: any) => {
    iconRef.current!.value = value.native;
    props.onChange && props.onChange(value.native);
    closeHandler();
  };

  /** 이모지창 열기 */
  const openHandler = () => {
    dispatch(
      uiActions.setEmojiOverlay({
        isOpen: true,
        onClose: closeHandler,
        onClear: clearHandler,
        onSelect: selectHandler,
      })
    );

    props.onClick && props.onClick();
  };

  /** 이모지창 닫기 */
  const closeHandler = () => {
    dispatch(uiActions.resetEmojiOverlay());
  };

  /** 이모지 입력값 초기화 */
  const clearHandler = () => {
    iconRef.current!.value = '';
    closeHandler();
  };

  return (
    <div className={props.className}>
      <input
        ref={iconRef}
        className={`${classes.icon} ${props.isDark ? classes.dark : ''}`}
        style={props.style}
        type="text"
        placeholder={props.placeholder}
        maxLength={2}
        onClick={openHandler}
        onChange={() => {}} // NOTE: for remove warning
        value={props.value}
        defaultValue={props.defaultValue}
        required={props.required}
        readOnly
      />
    </div>
  );
});

export default EmojiInput;
