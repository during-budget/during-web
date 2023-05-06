import Picker from '@emoji-mart/react';
import data from 'emoji_data_kr';
import React, { CSSProperties, useImperativeHandle, useRef, useState } from 'react';
import { BiEraser } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';
import Overlay from '../../UI/Overlay';
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
  useImperativeHandle(ref, () => {
    return {
      value: () => iconRef.current!.value,
    };
  });

  //   const id = `emoji-input-${props.id}`;
  const iconRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  /** 이모티콘 팝업창 닫기 함수 */
  const cancelHandler = () => {
    setOpen(false);
  };

  /** 선택한 이모티콘 값 삭제 함수 */
  const deleteIconHandler = () => {
    iconRef.current!.value = '';
    setOpen(false);
  };

  /** 이모티콘 클릭 시 동작하는 함수 */
  const onEmojiClick = (value: any) => {
    iconRef.current!.value = value.native;
    props.onChange && props.onChange(value.native);
    cancelHandler();
  };

  /** 이모지 팝업 오픈 함수 */
  const handleEmojiPopup = () => {
    setOpen(!open);
    props.onClick && props.onClick();
  };

  //   useEffect(() => {
  //     iconRef.current!.value = props.defaultValue || props.placeholder || '';
  //   }, [id]);

  return (
    <div className={props.className}>
      <input
        ref={iconRef}
        className={`${classes.icon} ${props.isDark ? classes.dark : ''}`}
        style={props.style}
        type="text"
        placeholder={props.placeholder}
        maxLength={2}
        onClick={handleEmojiPopup}
        onChange={() => {}} // NOTE: for remove warning
        value={props.value}
        defaultValue={props.defaultValue}
        required={props.required}
      />
      <Overlay className={classes.overlay} isOpen={open} closeHandler={cancelHandler}>
        <div className={classes.header}>
          <BiEraser className={classes.icon} onClick={deleteIconHandler} />
          <MdOutlineCancel className={classes.icon} onClick={cancelHandler} />
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
});

export default EmojiInput;
