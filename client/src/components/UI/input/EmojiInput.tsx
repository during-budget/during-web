import { css } from '@emotion/react';
import React, { CSSProperties, useImperativeHandle, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui';

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

const EmojiInput = React.forwardRef(
  (
    {
      id,
      className,
      value,
      defaultValue,
      onClick,
      onChange,
      placeholder,
      required,
      isDark,
      style,
    }: EmojiInputProps,
    ref
  ) => {
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => {
      return {
        value: () => iconRef.current!.value,
        clear: clearHandler,
      };
    });

    //   const id = `emoji-input-${id}`;
    const iconRef = useRef<HTMLInputElement>(null);

    /** 이모지 선택 */
    const selectHandler = (value: any) => {
      iconRef.current!.value = value.native;
      onChange && onChange(value.native);
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

      onClick && onClick();
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

    const iconStyle = (isDark?: boolean) =>
      css({
        flex: '0 0 auto',

        backgroundColor: isDark ? '#fff' : undefined,
      });

    return (
      <div className={className}>
        <input
          ref={iconRef}
          className="p-0 round-full w-inherit h-inherit text-inherit text-center pointer"
          css={iconStyle(isDark)}
          style={style}
          type="text"
          placeholder={placeholder}
          maxLength={2}
          onClick={openHandler}
          onChange={() => {}} // NOTE: for remove warning
          value={value}
          defaultValue={defaultValue}
          required={required}
          readOnly
        />
      </div>
    );
  }
);

export default EmojiInput;
