import React, { useImperativeHandle, useRef } from 'react';

const MemoInput = React.forwardRef(
  (props: { className: string; defaultValue?: string }, ref) => {
    useImperativeHandle(ref, () => {
      return {
        value: () => memoRef.current!.value,
      };
    });

    const memoRef = useRef<HTMLTextAreaElement>(null);

    return (
      <textarea
        ref={memoRef}
        className={props.className}
        rows={2}
        placeholder="상세 내용을 입력하세요"
        defaultValue={props.defaultValue}
      />
    );
  }
);

export default MemoInput;
