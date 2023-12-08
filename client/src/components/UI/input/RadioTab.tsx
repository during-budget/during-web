import { css } from '@emotion/react';
import classes from './RadioTab.module.css';

interface RadioTabProps {
  className?: string;
  name: string;
  values: RadioTabValueType[];
  isBold?: boolean;
  isLine?: boolean;
  isCenter?: boolean;
}

export interface RadioTabValueType {
  label: string;
  value?: string;
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
  hide?: boolean;
}

function RadioTab({ className, name, values, isBold, isLine, isCenter }: RadioTabProps) {
  const lineStyle = css({
    '& label': {
      paddingTop: '1rem',
      borderTop: '0.15rem solid transparent',
    },
    '& input:checked + label': {
      borderColor: 'var(--primary)',
    },
  });

  const tabStyle = css(
    {
      '& input': {
        display: 'none',
      },
      '& label': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 1rem',
        color: 'var(--gray-200)',
        cursor: 'pointer',
      },
      '& input:checked + label': {
        color: 'var(--primary)',
      },
      '& input:checked + label::after': {
        content: '""',
        display: 'flex',
        flexDirection: 'column',
        margin: '0.4rem auto',
        width: '0.25rem',
        height: '0.25rem',
        borderRadius: '50%',
        background: 'var(--primary)',
      },
    },
    isLine ? lineStyle : undefined
  );

  return (
    <ul className="flex scroll-x shrink-0" css={tabStyle}>
      {values
        .filter((item) => !item.hide)
        .map((item) => (
          <li key={item.value} className="shrink-0">
            <input
              id={`${name}-${item.value}`}
              type="radio"
              name={name}
              checked={item.checked || false}
              onChange={item.onChange}
              disabled={item.disabled}
            ></input>
            <label
              htmlFor={`${name}-${item.value}`}
              className={isBold ? 'semi-bold' : undefined}
            >
              {item.label}
            </label>
          </li>
        ))}
    </ul>
  );
}

export default RadioTab;
