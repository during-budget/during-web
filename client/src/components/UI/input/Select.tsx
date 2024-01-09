import { css } from '@emotion/react';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Inform from '../component/Inform';
import Button from '../button/Button';

// TODO: defaultValue를 그냥 value로 바꿔야할 거 같지 아마..? 일단 놔둬보자
const Select = React.forwardRef(
  (
    props: {
      className?: string;
      data: { element?: React.ReactNode; value?: string; label?: string }[];
      defaultValue?: string;
      value?: string;
      onChange?: (value?: string) => void;
      showEdit?: () => void;
      disabled?: boolean;
      listHeight?: string;
    },
    ref
  ) => {
    useImperativeHandle(ref, () => {
      return {
        value: () => {
          return selectRef.current!.value;
        },
      };
    });

    const selectRef = useRef<HTMLSelectElement>(null);
    const [selectState, setSelectState] = useState(props.defaultValue ?? props.value);
    const [isExpand, setIsExpand] = useState(false);

    // NOTE: 지출 & 수입 변경되었을 때 기본값 다시 세팅
    useEffect(() => {
      setSelectState(props.defaultValue ?? props.value);
    }, [props.defaultValue, props.value]);

    const toggleList = () => {
      setIsExpand((prev) => !prev);
    };

    const closeList = () => {
      setIsExpand(false);
    };

    const changeHandler = async (value?: string) => {
      await setSelectState(value);
      props.onChange && props.onChange(value);
    };

    const selectStyle = (isExpand: boolean) =>
      css({
        height: '3.5rem',
        '::after': {
          content: '"↓"',
          position: 'absolute',
          top: 'calc(50% - 0.625rem)',
          right: '1rem',
          display: 'block',
          zIndex: 2,
          fontFamily: 'inherit',
          '& ul': isExpand
            ? {
                visibility: 'visible',
                opacity: 1,
              }
            : undefined,
        },
      });

    const ulStyle = (isExpand: boolean) =>
      css({
        top: '-0.5rem',
        left: '-0.5rem',
        right: '-0.5rem',
        transition: '0.2s var(--fast-in)',
        opacity: isExpand ? 1 : 0,
        visibility: isExpand ? 'visible' : 'hidden',
      });

    return (
      <div className={`relative ${props.className}`} css={selectStyle(isExpand)}>
        {isExpand && <div className="fixed-0 pointer o-0" onClick={closeList} />}
        <div className="relative w-100 h-100">
          <div
            className="absolute position-0 round-sm o-0 z-4 pointer"
            onClick={toggleList}
          />
          <select
            ref={selectRef}
            value={selectState}
            // onChange={props.onChange}
            className="absolute z-2 o-1 w-100 h-100"
            disabled
          >
            {props.data.map((item, i) => {
              if (item.label) {
                return (
                  <option key={i} value={item.value}>
                    {item.label}
                  </option>
                );
              }
            })}
          </select>
          {!props.disabled && (
            <ul
              className="v-hidden absolute bg-white shadow-0.2 p-0.5 round-sm z-1 o-0"
              css={ulStyle(isExpand)}
            >
              <div
                className="scroll mt-4"
                style={{ maxHeight: props.listHeight || '28vh' }}
              >
                {props.data.length === 0 && <Inform>목록이 비어있습니다.</Inform>}
                {props.data.map((item, i) => {
                  if (item.element) {
                    return item.element;
                  }
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        changeHandler(item.value);
                        toggleList();
                      }}
                      className="p-0.5"
                    >
                      {item.label}
                    </li>
                  );
                })}
                {props.showEdit && (
                  <li onClick={props.showEdit}>
                    <Button
                      styleClass="extra"
                      className="text-2xs"
                      css={css({
                        transform:
                          'translateX(-0.5rem) /* NOTE: 시각적 중앙 정렬을 위한 보정 */',
                        '::before': {
                          font: 'var(--fa-font-solid)',
                          content: '"\\f303"',
                          fontSize: '0.75rem',
                          marginRight: '0.5rem'
                        },
                      })}
                    >
                      편집하기
                    </Button>
                  </li>
                )}
              </div>
            </ul>
          )}
        </div>
      </div>
    );
  }
);

export default Select;
