import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';

interface Tag {
  className?: string;
  isDark?: boolean;
}

function Tag({ className, isDark, children }: PropsWithChildren<Tag>) {
  return (
    <span
      className={`inline-block text-center text-gray-300 bg-gray-0 round-xs p-0.5 ${
        isDark ? 'bg-white' : ''
      } ${className}`}
      css={css({
        '&::before': {
          content: '"#"',
        },
      })}
    >
      {children}
    </span>
  );
}

export default Tag;
