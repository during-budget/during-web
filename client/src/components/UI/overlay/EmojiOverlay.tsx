import Picker from '@emoji-mart/react';
import data from 'emoji_data_kr';
import { BiEraser } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';
import { useAppSelector } from '../../../hooks/useRedux';
import Overlay from './Overlay';

const EmojiOverlay = () => {
  const { isOpen, onClose, onClear, onSelect } = useAppSelector(
    (state) => state.ui.emoji
  );

  return (
    <Overlay
      id="emoji-overlay"
      className="w-100 bg-white shadow-0.2 round-top-2lg"
      css={{
        zIndex: '20 !important',
        '& em-emoji-picker': {
          width: '100%',
          boxShadow: 'none',
          '--category-icon-size': '24px',
        },
      }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex j-end mt-0.5 mr-1">
        <BiEraser className='p-0.5' onClick={onClear} />
        <MdOutlineCancel className='p-0.5' onClick={onClose} />
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
