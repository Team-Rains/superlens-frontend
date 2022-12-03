import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import type { LensterPublication } from '@generated/types';
import { EyeIcon } from '@heroicons/react/outline';
import getURLs from '@lib/getURLs';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import useLensGated from 'src/hooks/useLensGated';

interface Props {
  publication: LensterPublication;
}

const PublicationBody: FC<Props> = ({ publication }) => {
  const { pathname } = useRouter();
  const showMore = publication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]';

  // instead of showing the content right away, just show a bit header or description
  // Then on click show the complete decrypted post.

  return (
    <div className="break-words">
      {
        publication?.isGated ? (
          <>
            <p>Click to View Premium Content</p>
          </>
        ) : (
          <p>{publication?.metadata?.content}</p>
        )
      }
      {showMore && (
        <div className="mt-4 text-sm text-gray-500 font-bold flex items-center space-x-1">
          <EyeIcon className="h-4 w-4" />
          <Link href={`/posts/${publication?.id}`}>Show more</Link>
        </div>
      )}
      {publication?.metadata?.media?.length > 0 ? (
        <Attachments attachments={publication?.metadata?.media} publication={publication} />
      ) : (
        publication?.metadata?.content &&
        getURLs(publication?.metadata?.content)?.length > 0 && (
          <IFramely url={getURLs(publication?.metadata?.content)[0]} />
        )
      )}
    </div>
  );
};

export default PublicationBody;
