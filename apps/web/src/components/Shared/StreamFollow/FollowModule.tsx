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
import { LensHubProxy, SuperfluidForwarder, Factory, Staking } from 'abis';
import { LENSHUB_PROXY, POLYGONSCAN_URL, RELAY_ON, SIGN_WALLET, SUPERFLUID_FORWARDER, USDCX, FACTORY} from 'data/constants';
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
import { useAccount, useBalance, useContractWrite, useContractReads, useSignTypedData, usePrepareContractWrite } from 'wagmi';
import Loader from '../Loader';
import Slug from '../Slug';
import StreamPiece from "../StreamPiece";
import BalancePiece from "../BalancePiece";
import UserBalance from '../UserBalance';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  setShowFollowModal: Dispatch<boolean>;
  again: boolean;
}

const FollowModule: FC<Props> = ({ profile, setFollowing, setShowFollowModal, again }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // hardcoded stuff
  const subscriptionAmount = (10*1e18/3600/24/30).toFixed(0);

  const { data: balanceData } = useBalance({
    address: currentProfile?.ownedBy,
    token: USDCX,
    formatUnits: 18,
    watch: true
  });
  let hasAmount = false;

  if (balanceData && parseFloat(balanceData?.formatted) < parseFloat("1")) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const forwarderContract = {
    address: SUPERFLUID_FORWARDER,
    abi: SuperfluidForwarder,
  }

  const factoryContract = {
    address: FACTORY,
    abi: Factory,
  }

  const { data: userContracts } = useContractReads({
    contracts: [
      {
        ...factoryContract,
        functionName: 'creatorSet',
        args: [profile?.ownedBy] //here should be using the stream manager address instead
      },
    ],
  });
  const [streamManager, socialToken, stakingContractAddress, ...other] = userContracts?.[0];

  const stakingContract = {
    address: stakingContractAddress,
    abi: Staking,
  }
  
  const { data: socialTokenBalance } = useBalance({
    address: currentProfile?.ownedBy,
    token: socialToken,
    formatUnits: 18,
    watch: true
  });
  const { data: streamingFlowrate, isError } = useContractReads({
    contracts: [
      {
        ...forwarderContract,
        functionName: 'getFlowrate',
        args: [USDCX, currentProfile?.ownedBy, streamManager] //here should be using the stream manager address instead
      },
    ],
  });
  const cleanFlowrate = Number(streamingFlowrate?.toString()).toString();
  const isSubscribed = cleanFlowrate >= subscriptionAmount;
  const { config } = usePrepareContractWrite({
    address: SUPERFLUID_FORWARDER,
    abi: SuperfluidForwarder,
    functionName: 'createFlow',
    args: [
      USDCX,
      currentProfile?.ownedBy,
      streamManager,
      subscriptionAmount.toString(), //hardcoding 10$/month
      "0x"
    ]
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  return (
    <div className="p-5">
      <div className="text-center py-2 space-x-1.5">
        <StreamPiece sender={currentProfile?.handle} receiver={profile?.handle} />
        <BalancePiece 
          account={currentProfile?.ownedBy}
          tokenAddress={USDCX}
          tokenName="USDCx"
          flowRate="10"
          isSubscribed={isSubscribed}
        />
      </div>
      <div className="text-center py-2 space-x-1.5">
        <StreamPiece receiver={currentProfile?.handle} sender={profile?.handle} />
        <BalancePiece 
          account={currentProfile?.ownedBy}
          tokenAddress={socialToken}
          tokenName={`${((profile?.handle).toUpperCase()).split('.')[0]}`}
          flowRate="10"
          isSubscribed={isSubscribed}
        />
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
            <div>Receive a stream of ${((profile?.handle).toUpperCase()).split('.')[0]} tokens</div>
          </li>
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>10% of @{profile?.handle}&rsquo;s income => community rewards</div>
          </li>
          <li className="flex space-x-2 tracking-normal leading-6">
            <div>•</div>
            <div>Stake ${((profile?.handle).toUpperCase()).split('.')[0]} to <span className="font-bold">receive USDCx rewards</span></div>
          </li>
        </ul>
      
        {
          !isSubscribed && (
            hasAmount 
            ? (
                <Button
                  className="text-sm !px-3 !py-1.5 mt-5"
                  variant="super"
                  outline
                  onClick={() => write?.() }
                  icon={(<StarIcon className="w-4 h-4" />)}
                >
                  Super follow {again ? 'again' : 'now'}
                </Button>
            ) : (
              <div className="mt-5 text-center font-bold">
                <a 
                  href="http://app.superfluid.finance" 
                >
                  Get some Super USDC to subscribe
                </a>
              </div>
            )
          )
        }
        
      </div>    
    </div>
  );
};

export default FollowModule;
