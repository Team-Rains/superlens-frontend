import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { StarIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import type { Profile } from 'lens';
import dynamic from 'next/dynamic';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import { PROFILE } from 'src/tracking';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message="Loading super follow" />
});

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: string;
  again?: boolean;
  isSubscribed: boolean;
  setOfContracts: string;
}

const StreamFollow: FC<Props> = ({ profile, setFollowing, showText = false, again = false, isSubscribed, setOfContracts }) => {
  const [showFollowModal, setShowFollowModal] = useState(false);

  return (
    <>
      <Button
        className="text-sm !px-3 !py-1.5"
        variant="super"
        outline
        onClick={() => {
          setShowFollowModal(!showFollowModal);
          Leafwatch.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        aria-label="Stream Follow"
        icon={<StarIcon className="w-4 h-4" />}
      >
        {showText}
      </Button>
      <Modal
        title={
          <span>
            Stream follow <Slug slug={profile?.handle} prefix="@" /> {again ? 'again' : ''}
          </span>
        }
        icon={<StarIcon className="w-5 h-5 text-pink-500" />}
        show={showFollowModal}
        onClose={() => setShowFollowModal(false)}
      >  
        <FollowModule
          profile={profile}
          setFollowing={setFollowing}
          setShowFollowModal={setShowFollowModal}
          again={again}
          isSubscribed={isSubscribed}
          setOfContracts={setOfContracts}
        />
      </Modal>
    </>
  );
};

export default StreamFollow;
