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
  const boldStyle = isBold === false ? {} : { fontWeight: '600' };
  const lineClass = isLine ? classes.line : '';
  const centerClass = isCenter ? classes.center : '';

  return (
    <ul className={`${classes.tab} ${lineClass} ${centerClass} ${className}`}>
      {values
        .filter((item) => !item.hide)
        .map((item) => (
          <li key={item.value}>
            <input
              id={`${name}-${item.value}`}
              type="radio"
              name={name}
              checked={item.checked || false}
              onChange={item.onChange}
              disabled={item.disabled}
            ></input>
            <label htmlFor={`${name}-${item.value}`} style={boldStyle}>
              {item.label}
            </label>
          </li>
        ))}
    </ul>
  );
}

export default RadioTab;
