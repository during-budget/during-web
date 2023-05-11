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
        WebkitMaskImage: mask,
        maskImage: mask,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Mask;
