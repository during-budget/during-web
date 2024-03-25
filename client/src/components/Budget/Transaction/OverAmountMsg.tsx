import classes from './OverAmountMsg.module.css';

function OverAmountMsg(props: { overAmount: number; className?: string }) {
    const overAmount = props.overAmount;

    let overAmountMsg = '';
    if (overAmount < 0) {
        overAmountMsg = `예정보다 ${-1 * overAmount}원 절약`;
    } else if (overAmount > 0) {
        overAmountMsg = `예정보다 ${overAmount}원 초과`;
    } else {
        overAmountMsg = `예정대로 실행`;
    }

    return (
        <p className={`text-gray-300 ${props.className}`}>
            {overAmountMsg}
        </p>
    );
}

export default OverAmountMsg;
