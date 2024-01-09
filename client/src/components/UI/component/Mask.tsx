import React, { PropsWithChildren } from 'react';

interface MaskProps {
  mask: string;
  className?: string;
  style?: React.CSSProperties;
}

const Mask = ({ mask, className, style, children }: PropsWithChildren<MaskProps>) => {
  return (
    <div
      className={className}
      style={{
        WebkitMaskImage: `url('${mask}')`,
        maskImage: `url('${mask}')`,
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Mask;
