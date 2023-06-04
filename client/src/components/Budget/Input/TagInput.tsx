import React, { useImperativeHandle, useState } from 'react';
import classes from './TagInput.module.css';
import Tag from '../../UI/Tag';

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
        value: () => tagState,
      };
    });

    const [tagState, setTagState] = useState<String[]>(props.defaultValue || []);

    const keyUpHandler = (event: React.KeyboardEvent) => {
      const input = event.target as HTMLInputElement;

      if (
        [' ', 'Enter', '#'].includes(event.key) &&
        (input.value !== '#' || input.value.trim() !== '')
      ) {
        const values = input.value.split('#');

        input.value = event.key === '#' ? '#' : '';

        addTag(values);
      }
    };

    const blurHandler = (event: React.FocusEvent) => {
      const input = event.target as HTMLInputElement;

      const values = input.value.split('#');
      input.value = '';
      addTag(values);
    };

    const addTag = (values: string[]) => {
      setTagState((prevState) => {
        const filteredValues = values.filter(
          (item) =>
            item !== '' && item !== ' ' && !prevState.find((prev) => prev === item)
        );

        return [...prevState, ...filteredValues];
      });
    };

    const removeHandler = (event: React.MouseEvent) => {
      const target = event.target as HTMLSpanElement;

      setTagState((prevState) => {
        return prevState.filter((item) => {
          return item.trim() !== target.innerText.trim();
        });
      });
    };

    const preventSubmit = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    };

    const emptyClass = tagState.length === 0 ? classes.empty : '';
    const containerClass = [classes.container, emptyClass].join(' ');

    return (
      <ul className={containerClass}>
        {tagState.map((item, i) => (
          <li key={i} onClick={removeHandler}>
            <Tag isDark={true}>{item}</Tag>
          </li>
        ))}
        <li>
          <input
            className={props.className}
            type="text"
            onKeyUp={keyUpHandler}
            onKeyDown={preventSubmit}
            onBlur={blurHandler}
            placeholder="태그를 입력하세요"
          />
        </li>
      </ul>
    );
  }
);

export default TagInput;
