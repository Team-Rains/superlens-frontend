import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import type { LensterPublication } from '@generated/types';
import { EyeIcon } from '@heroicons/react/outline';
import getURLs from '@lib/getURLs';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState, useEffect } from 'react';
import useLensGated from 'src/hooks/useLensGated';
import useIsSubscribed from 'src/hooks/useIsSubscribed';

interface Props {
  publication: LensterPublication;
}

const PublicationBody: FC<Props> = ({ publication }) => {
  const { pathname } = useRouter();
  const showMore = publication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]';
  const isSubscribed = useIsSubscribed(publication?.profile?.ownedBy);

  // instead of showing the content right away, just show a bit header or description
  // Then on click show the complete decrypted post.


  const [decryptedData, setDecryptedData] = useState<any>();
  const hookLensGated = useLensGated();


  if (publication?.isGated) {
    try {
      hookLensGated.decryptPostMetadata(publication?.metadata).then((result) => {
        setDecryptedData(result);
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div 
      className="break-words"
    >
      {
        (publication?.isGated && !isSubscribed) ? (
          <>
            <p>Click to View Premium Content</p>
          </>
        ) : publication?.isGated ? (
          <p>{decryptedData?.content}</p>
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
