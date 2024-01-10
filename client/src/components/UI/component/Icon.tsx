import { PropsWithChildren } from 'react';

const DEFAULT_SIZE = '2.5rem';
const DEFUALT_FONT_SIZE = '1.5rem';
const DEFUALT_BORDER_RADIUS = '50%';
const DEFAULT_SQUARE_BORDER_RADIUS = '0.5rem';

interface IconProps {
  className?: string;
  size?: string;
  fontSize?: string;
  borderRadius?: string;
  isSquare?: boolean;
}

function Icon(props: PropsWithChildren<IconProps>) {
  const width = props.size || DEFAULT_SIZE;
  const height = props.size || DEFAULT_SIZE;
  const fontSize = props.fontSize || DEFUALT_FONT_SIZE;
  const borderRadius =
    props.borderRadius ||
    (props.isSquare ? DEFAULT_SQUARE_BORDER_RADIUS : DEFUALT_BORDER_RADIUS);

  const iconStyle = { width, height, fontSize, borderRadius, flex: '0 0 auto' };

  return (
    <span
      className={`flex-center bg-gray-0 ${props.className ? props.className : ''}`}
      css={iconStyle}
    >
      {props.children}
    </span>
  );
}

export default Icon;
