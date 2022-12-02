import AllowanceButton from '@components/Settings/Allowance/Button';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { WarningMessage } from '@components/UI/WarningMessage';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { LensterFollowModule } from '@generated/types';
import { StarIcon, UserIcon } from '@heroicons/react/outline';
import formatAddress from '@lib/formatAddress';
import getSignature from '@lib/getSignature';
import getTokenImage from '@lib/getTokenImage';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { LensHubProxy, SuperfluidForwarder } from 'abis';
import { LENSHUB_PROXY, POLYGONSCAN_URL, RELAY_ON, SIGN_WALLET, SUPERFLUID_FORWARDER, USDCX} from 'data/constants';
import type { Profile } from 'lens';
import {
  FollowModules,
  useApprovedModuleAllowanceAmountQuery,
  useCreateFollowTypedDataMutation,
  useSuperFollowQuery
} from 'lens';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { PROFILE } from 'src/tracking';
import { useAccount, useBalance, useContractWrite, useSignTypedData, usePrepareContractWrite } from 'wagmi';

import Loader from '../Loader';
import Slug from '../Slug';

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  setShowFollowModal: Dispatch<boolean>;
  again: boolean;
}

const FollowModule: FC<Props> = ({ profile, setFollowing, setShowFollowModal, again }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  console.log(currentProfile);

  const { config } = usePrepareContractWrite({
    address: SUPERFLUID_FORWARDER,
    abi: SuperfluidForwarder,
    functionName: 'createFlow',
    args: [
      USDCX,
      currentProfile?.ownedBy,
      profile.ownedBy, // sending funds straight to user for now
      (10*1e18/3600/24/30).toFixed(0).toString(), //hardcoding 10$/month
      "0x"
    ]
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  /*
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const [allowed, setAllowed] = useState(true);
  const { address } = useAccount();

  const onCompleted = () => {
    setFollowing(true);
    setShowFollowModal(false);
    toast.success('Followed successfully!');
    Leafwatch.track(PROFILE.SUPER_FOLLOW);
  };

  const { data, loading } = useSuperFollowQuery({
    variables: { request: { profileId: profile?.id } },
    skip: !profile?.id
  });

  const followModule: any = data?.profile?.followModule;

  const { data: allowanceData, loading: allowanceLoading } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: followModule?.amount?.asset?.address,
        followModules: [FollowModules.FeeFollowModule],
        collectModules: [],
        referenceModules: []
      }
    },
    skip: !followModule?.amount?.asset?.address || !currentProfile,
    onCompleted: (data) => {
      setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
    }
  });

  const { data: balanceData } = useBalance({
    address: currentProfile?.ownedBy,
    token: followModule?.amount?.asset?.address,
    formatUnits: followModule?.amount?.asset?.decimals,
    watch: true
  });
  let hasAmount = false;

  if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(followModule?.amount?.value)) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const { broadcast, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createFollowTypedData, { loading: typedDataLoading }] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      try {
        const { id, typedData } = createFollowTypedData;
        const { profileIds, datas: followData, deadline } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
          follower: address,
          profileIds,
          datas: followData,
          sig
        };

        setUserSigNonce(userSigNonce + 1);
        if (!RELAY_ON) {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }

        const {
          data: { broadcast: result }
        } = await broadcast({ request: { id, signature } });

        if ('reason' in result) {
          write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      } catch {}
    },
    onError
  });

  const createFollow = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    createFollowTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          follow: [
            {
              profile: profile?.id,
              followModule: {
                feeFollowModule: {
                  amount: {
                    currency: followModule?.amount?.asset?.address,
                    value: followModule?.amount?.value
                  }
                }
              }
            }
          ]
        }
      }
    });
  };
  if (loading) {
    return <Loader message="Loading super follow" />;
  }
  */


  const createFollow = () => {
    if (1==1) {
      console.log("button clicked!")
    }
  }

  return (
    <div className="p-5">
      <div className="pb-2 space-y-1.5">
        <div className="text-lg font-bold">
          <span>Stream follow </span>
        <img
          className="w-7 h-7 mx-2 inline"
          height={28}
          width={28}
          src="https://app.superfluid.finance/gifs/stream-loop.gif"
          alt="stream"
          title="Streamin Friggin Mone"
        />
        <Slug slug={profile?.handle} prefix="@" /> {again ? 'again' : ''}
        </div>
      </div>
      <div className="flex items-center py-2 space-x-1.5">
        {/*<img
          className="w-7 h-7"
          height={28}
          width={28}
          src="https://raw.githubusercontent.com/superfluid-finance/assets/master/public/tokens/usdc/icon.svg" // throw in USDCx logo
          alt="USDCx"
          title="Super USD Coin"
        />*/}
        <span className="font-boldest">Stream: </span>
        <span className="space-x-1">
          <span className="text-2xl font-bold">10</span>
          <span className="text-xs"> USDCx / month</span>
        </span>
        <span> to </span>
        <Slug slug={profile?.handle}/> 
      </div>
      <div className="flex items-center py-2 space-x-1.5">
        <span className="font-boldest">Receive: </span>
        <span className="space-x-1">
          <span className="text-2xl font-bold">10</span>
          <span className="text-xs"> ${(profile?.handle).toUpperCase()}x / month</span>
        </span>
        <span> to </span>
        <Slug slug={currentProfile?.handle}/> 
      </div>
      <div className="pt-5 space-y-2">
        <div className="text-lg font-bold">Perks you get</div>
        <ul className="space-y-1 text-md text-gray-500">
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>See @{profile?.handle}&rsquo;s gated publications</div>
          </li>
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>Receive a stream of ${(profile?.handle).toUpperCase()}x tokens</div>
          </li>
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>10% of @{profile?.handle}&rsquo;s income => community rewards</div>
          </li>
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>Stake ${(profile?.handle).toUpperCase()}x to <span className="font-bold">receive USDCx rewards</span></div>
          </li>
        </ul>
      
        <Button
                className="text-sm !px-3 !py-1.5 mt-5"
                variant="super"
                outline
                onClick={() => write?.() }
                icon={(<StarIcon className="w-4 h-4" />)}
              >
                Super follow {again ? 'again' : 'now'}
              </Button>
      </div>
      {/*
        {currentProfile ? (
          allowanceLoading ? (
            <div className="mt-5 w-28 rounded-lg h-[34px] shimmer" />
          ) : allowed ? (
            hasAmount ? (
              <Button
                className="text-sm !px-3 !py-1.5 mt-5"
                variant="super"
                outline
                onClick={createFollow}
                disabled={typedDataLoading || signLoading || writeLoading || broadcastLoading}
                icon={
                  typedDataLoading || signLoading || writeLoading || broadcastLoading ? (
                    <Spinner variant="super" size="xs" />
                  ) : (
                    <StarIcon className="w-4 h-4" />
                  )
                }
              >
                Super follow {again ? 'again' : 'now'}
              </Button>
            ) : (
              <WarningMessage
                className="mt-5"
                message={<Uniswap module={followModule as LensterFollowModule} />}
              />
            )
          ) : (
            <div className="mt-5">
              <AllowanceButton
                title="Allow follow module"
                module={allowanceData?.approvedModuleAllowanceAmount[0]}
                allowed={allowed}
                setAllowed={setAllowed}
              />
            </div>
          )
        ) : null}
       */}
    </div>
  );
};

export default FollowModule;
