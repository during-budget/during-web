import React, { useEffect, useImperativeHandle, useState } from 'react';
import classes from './CodeField.module.css';
import InputField from '../UI/InputField';

const CODE_LENGTH = 6;

const CodeField = React.forwardRef((props: { className?: string }, ref) => {
    const [inputState, setInputState] =
        useState<NodeListOf<HTMLInputElement>>();

    useImperativeHandle(ref, () => {
        return {
            value: () => {
                let value = '';

                inputState?.forEach((input, i) => {
                    value += input.value;
                });

                return value;
            },
        };
    });

    useEffect(() => {
        const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '#register-code-inputs input'
        );
        setInputState(inputs);

        inputs.forEach((input, inputIdx) => {
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
            <div id="register-code-inputs" className={classes.code}>
                <input type="number"></input>
                <input type="number"></input>
                <input type="number"></input>
                <input type="number"></input>
                <input type="number"></input>
                <input type="number"></input>
            </div>
            <p className={classes.codeInform}>
                이메일로 보내드린 확인 코드 여섯 자리를 입력하세요.
            </p>
        </InputField>
    );
});

export default CodeField;
