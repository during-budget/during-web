import React, { useImperativeHandle, useRef } from 'react';

const TagInput = React.forwardRef(
    (
        props: {
            className?: string;
            defaultValue?: string[];
        },
        ref
    ) => {
        useImperativeHandle(ref, () => {
            return {
                value: () => [tagsRef.current!.value].filter((item) => item),
            };
        });

        const tagsRef = useRef<HTMLInputElement>(null);

        return (
            <input
                ref={tagsRef}
                className={props.className}
                type="text"
                placeholder="태그를 입력하세요"
                defaultValue={props.defaultValue![0]}
            />
        );
    }
);

export default TagInput;
