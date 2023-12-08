import { useEffect } from 'react';
import { css } from '@emotion/react';

interface InputFieldProps {
  id: string;
  isFloatLabel?: boolean;
  isReverse?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface FieldStyleProps {
  isFloat?: boolean;
  isReverse?: boolean;
}

function InputField({
  id,
  isFloatLabel,
  isReverse,
  className,
  children,
}: InputFieldProps) {
  // NOTE: For scroll on focus
  useEffect(() => {
    const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      `#${id} input`
    );
    inputs.forEach((input) => {
      input.addEventListener('click', () => {
        input.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    });
  });

  const fieldStyle = ({ isFloat, isReverse }: FieldStyleProps) =>
    css(
      {
        '& label': {
          fontWeight: 600,
        },
        flexDirection: isReverse || isFloat ? 'column-reverse' : 'column',
      },
      isFloat ? floatStyle : undefined
    );

  const floatStyle = css({
    '& input': {
      paddingTop: '1.5rem',
    },
    '& input + label': {
      position: 'absolute',
      top: '1.125rem',
      left: '0.75rem',
      marginBottom: 0,
      color: 'var(--gray-300)',
      transition: 'top 0.3s var(--fast-in)',
    },
    '& input:focus + label': {
      top: '0.5rem',
      fontSize: '0.75rem',
    },
    "& input:not([value='']) + label": {
      top: '0.5rem',
      fontSize: '0.75rem',
    },
  });

  return (
    <div
      id={id}
      className={`w-100 relative text-left flex gap-sm ${className}`}
      css={fieldStyle({ isFloat: isFloatLabel, isReverse })}
    >
      {children}
    </div>
  );
}

export default InputField;
