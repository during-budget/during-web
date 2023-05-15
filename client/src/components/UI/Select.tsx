import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Button from './Button';
import Inform from './Inform';
import classes from './Select.module.css';

// TODO: defaultValue를 그냥 value로 바꿔야할 거 같지 아마..? 일단 놔둬보자
const Select = React.forwardRef(
  (
    props: {
      className?: string;
      data: { element?: React.ReactNode; value?: string; label: string }[];
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
    const [selectState, setSelectState] = useState(props.defaultValue || props.value);
    const [isExpand, setIsExpand] = useState(false);

    // NOTE: 지출 & 수입 변경되었을 때 기본값 다시 세팅
    useEffect(() => {
      setSelectState(props.defaultValue || props.value);
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

    const expandClass = isExpand ? classes.expand : '';

    return (
      <div className={`${classes.select} ${expandClass} ${props.className}`}>
        {isExpand && <div className={classes.backdrop} onClick={closeList} />}
        <div className={classes.wrapper}>
          <div className={classes.clickable} onClick={toggleList} />
          <select
            ref={selectRef}
            value={selectState}
            // onChange={props.onChange}
            disabled
          >
            {props.data.map((item, i) => (
              <option key={i} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {!props.disabled && (
            <ul>
              <div
                className={classes.list}
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
                    >
                      {item.label}
                    </li>
                  );
                })}
                {props.showEdit && (
                  <li onClick={props.showEdit}>
                    <Button className={classes.edit} styleClass="extra">
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
