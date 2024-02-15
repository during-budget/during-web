import { css } from '@emotion/react';
import { PropsWithChildren } from 'react';
import { cn } from '../../../util/cn';

interface Tag {
  className?: string;
  isDark?: boolean;
}

function Tag({ className, isDark, children }: PropsWithChildren<Tag>) {
  return (
    <span
      className={cn(
        'inline-block text-center text-gray-300 bg-gray-0 round-xs p-0.5',
        isDark ? 'bg-white' : ''
      )}
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
