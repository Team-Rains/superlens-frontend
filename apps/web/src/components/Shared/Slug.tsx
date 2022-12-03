import clsx from 'clsx';
import type { FC } from 'react';

interface Props {
  slug: string;
  prefix?: string;
  className?: string;
  showBox?: boolean;
}

const Slug: FC<Props> = ({ slug, prefix, className = '', showBox = false }) => {
  return (
    <span
      className={clsx(
        'text-transparent bg-clip-text bg-gradient-to-r from-brand-600 dark:from-brand-400 to-pink-600 dark:to-pink-400',
        className,
        showBox ? "p-3 rounded-lg" : ""
      )}
      style={{ 
        boxShadow: showBox ? "rgb(204 204 204 / 50%) 0px 0px 6px 3px" : ""
      }}
    >
      {prefix}
      {slug}
    </span>
  );
};

export default Slug;
