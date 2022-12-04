import { ethers } from 'ethers';
import {
  ContractType,
  EncryptedMetadata,
  LensEnvironment,
  LensGatedSDK,
  MetadataV2,
  NftOwnership
} from '@lens-protocol/sdk-gated';
import uploadToArweave from '@lib/uploadToArweave';
import { useAppStore } from 'src/store/app';
import { useContractReads } from 'wagmi';
import { SUPERFLUID_FORWARDER, USDCX } from 'data/constants';
import { SuperfluidForwarder } from 'abis';
import useContractSet from './useContractSet';

interface Props {
  targetUser: String;
}

const useIsSubscribed = (targetUser: String) => {
  const subscriptionAmount = (10*1e18/3600/24/30).toFixed(0);

  const currentProfile = useAppStore((state) => state.currentProfile);
  const contractSet = useContractSet(targetUser);

  const { streamManager } = contractSet;
  

  const forwarderContract = {
    address: SUPERFLUID_FORWARDER,
    abi: SuperfluidForwarder,
  }

  const { data: streamingFlowrate, isError } = useContractReads({
    contracts: [
      {
        ...forwarderContract,
        functionName: 'getFlowrate',
        args: [USDCX, currentProfile?.ownedBy, streamManager] 
      },
    ],
  });

  console.log("streamManager in hook; ", streamManager);
  console.log(streamingFlowrate)
  const isSubscribed = Number(streamingFlowrate?.toString()).toString() >= subscriptionAmount;
  console.log("isSubscribed in hook: ", isSubscribed);

  return isSubscribed;
};
export default useIsSubscribed;
