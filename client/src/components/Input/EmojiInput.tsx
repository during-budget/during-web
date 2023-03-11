function EmojiInput(props: { id: string; className: string }) {
    return (
        <div className={props.className}>
            <input type="text" placeholder="😀"></input>
        </div>
    );
}

export default EmojiInput;
