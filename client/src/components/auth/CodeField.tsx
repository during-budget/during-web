import { useEffect } from 'react';
import classes from './RegisterForm.module.css';
import InputField from '../UI/InputField';

const CODE_LENGTH = 6;

function CodeField() {
    useEffect(() => {
        const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '#register-code-inputs input'
        );
        inputs.forEach((input, i) => {
            input.addEventListener('input', () => {
                const value = input.value;

                if (value.length > 1) {
                    if (i === 0) {
                        // paste
                        [...value].forEach((char, i) => {
                            if (i < CODE_LENGTH) {
                                inputs[i].focus();
                                inputs[i].value = char;
                            }
                        });
                    } else {
                        // focus
                        if (i !== inputs.length - 1 && value !== '') {
                            inputs[i + 1].focus();
                            inputs[i + 1].value = value[1] || '';
                        }

                        // maxLength
                        input.value = value.slice(0, 1);
                    }
                }
            });

            input.addEventListener('keyup', (event: KeyboardEvent) => {
                if (event.key === 'Backspace' && i !== 0) {
                    if (input.value) input.value = '';
                    // inputs[i - 1].value = '';
                    inputs[i - 1].focus();
                }
            });
        });
    });

    return (
        <InputField id="register-code-field" className={classes.codeField}>
            <p className={classes.codeInform}>
                이메일로 보내드린 확인 코드 여섯 자리를 입력하세요.
            </p>
            <div id="register-code-inputs" className={classes.code}>
                <input type="text"></input>
                <input type="text"></input>
                <input type="text"></input>
                <input type="text"></input>
                <input type="text"></input>
                <input type="text"></input>
            </div>
        </InputField>
    );
}

export default CodeField;
