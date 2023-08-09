import { useEffect } from 'react';
import classes from './InputField.module.css';

function InputField(props: {
  id: string;
  isFloatLabel?: boolean;
  isReverse?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  // NOTE: For scroll on focus
  useEffect(() => {
    const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      `#${props.id} input`
    );
    inputs.forEach((input) => {
      input.addEventListener('click', () => {
        input.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    });
  });

  const className = `w-100 relative text-left flex gap-sm ${
    props.isFloatLabel ? classes.floating : ''
  }`;

  return (
    <div
      id={props.id}
      className={`${className} ${props.className}`}
      css={{
        '& label': {
          fontWeight: 600,
        },
        flexDirection:
          props.isReverse || props.isFloatLabel ? 'column-reverse' : 'column',
      }}
    >
      {props.children}
    </div>
  );
}

export default InputField;
