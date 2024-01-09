import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';

interface Tag {
  isDark?: boolean;
}

function Tag({ isDark, children }: PropsWithChildren<Tag>) {
  return (
    <span
      className={`inline-block text-center text-gray-300 bg-gray-0 round-sm p-0.5 ${
        isDark ? 'bg-white' : ''
      }`}
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
