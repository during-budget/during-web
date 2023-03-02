import { useEffect } from 'react';
import classes from './RegisterForm.module.css';
import InputField from '../UI/InputField';

function CodeField() {
    useEffect(() => {
        const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
            '#register-code-inputs input'
        );
        inputs.forEach((input, i) => {
            input.addEventListener('input', () => {
                const value = input.value;

                // focus
                if (i !== inputs.length - 1 && value !== '') {
                    inputs[i + 1].focus();
                }

                // maxLength
                if (value.length > 1) {
                    input.value = value.slice(0, 1);
                }
            });

            input.addEventListener('keyup', (event: KeyboardEvent) => {
                if (event.key === 'Backspace' && i !== 0) {
                    input.value = '';
                    inputs[i - 1].value = '';
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
                <input type="number"></input>
                <input type="number"></input>
                <input type="number"></input>
                <input type="number"></input>
                <input type="number"></input>
                <input type="number"></input>
            </div>
        </InputField>
    );
}

export default CodeField;
