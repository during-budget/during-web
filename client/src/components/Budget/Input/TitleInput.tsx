import React, { useImperativeHandle, useRef } from 'react';

const TitleInput = React.forwardRef(
    (props: { className: string; defaultValue?: string[] }, ref) => {
        useImperativeHandle(ref, () => {
            return {
                value: getTitles,
            };
        });

        const titlesRef = useRef<HTMLDivElement>(null);

        const getTitles = () => {
            const titles: string[] = [];

            titlesRef.current!.childNodes.forEach((input: any) => {
                titles.push(input.value);
            });

            return titles;
        };

        return (
            <div ref={titlesRef} className={props.className}>
                <input
                    type="text"
                    placeholder="내용을 입력하세요"
                    defaultValue={props.defaultValue![0]}
                />
            </div>
        );
    }
);

export default TitleInput;
