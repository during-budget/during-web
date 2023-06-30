import Picker from '@emoji-mart/react';
import data from 'emoji_data_kr';
import { BiEraser } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';
import { useAppSelector } from '../../hooks/redux-hook';
import classes from './EmojiOverlay.module.css';
import Overlay from './Overlay';

const EmojiOverlay = () => {
  const { isOpen, onClose, onClear, onSelect } = useAppSelector(
    (state) => state.ui.emoji
  );

  return (
    <Overlay
      id="emoji-overlay"
      className={classes.overlay}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className={classes.header}>
        <BiEraser className={classes.icon} onClick={onClear} />
        <MdOutlineCancel className={classes.icon} onClick={onClose} />
      </div>
      <Picker
        data={data}
        locale="kr"
        onEmojiSelect={onSelect}
        navPosition="bottom"
        previewPosition="none"
        skinTonePosition="search"
        dynamicWidth={true}
      />
    </Overlay>
  );
};

export default EmojiOverlay;
