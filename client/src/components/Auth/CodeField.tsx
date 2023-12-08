import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import InputField from '../UI/input/InputField';

export const CODE_LENGTH = 6;

const CodeField = React.forwardRef((props: { className?: string }, ref) => {
  const [inputState, setInputState] = useState<NodeListOf<HTMLInputElement>>();
  const fieldsRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      value: () => {
        let value = '';

        inputState?.forEach((input, i) => {
          value += input.value;
        });

        return value;
      },
      clear: () => {
        inputState?.forEach((input) => {
          input.value = '';
        });
      },
      focus: () => {
        const input = document.querySelector(
          '#register-code-inputs input'
        ) as HTMLInputElement;
        input && input.focus();
      },
    };
  });

  useEffect(() => {
    Array.from(new Array(CODE_LENGTH)).forEach((_, i) => {
      const input = document.createElement('input');
      input.type = 'number';
      input.name = `code-${i}`;
      input.classList.add('text-center');
      input.classList.add('round-sm');
      fieldsRef.current?.appendChild(input);
    });

    const inputs = fieldsRef.current?.childNodes as NodeListOf<HTMLInputElement>;
    setInputState(inputs);

    inputs?.forEach((input, inputIdx) => {
      input.addEventListener('input', () => {
        // strip non-numeric value
        const value = input.value.replace(/[^0-9]+/g, '');
        input.value = value;

        if (value.length < 1) {
          return;
        } else {
          // input & paste -> focus next
          [...value].forEach((char, i) => {
            if (inputIdx + i < CODE_LENGTH) {
              inputs[inputIdx + i].focus();
              inputs[inputIdx + i].value = char;
            }
          });
        }
      });

      input.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.key === 'Backspace' && inputIdx !== 0) {
          if (input.value) input.value = '';
          inputs[inputIdx - 1].focus();
        }
      });

      input.addEventListener('click', () => {
        inputs[inputIdx].value = '';
      });
    });
  }, []);

  return (
    <InputField id="register-code-field" className={props.className}>
      <div ref={fieldsRef} id="register-code-inputs" className="flex gap-xs"></div>
      <p className="text-ms text-center">
        이메일로 보내드린 확인 코드 여섯 자리를 입력하세요.
      </p>
    </InputField>
  );
});

export default CodeField;
