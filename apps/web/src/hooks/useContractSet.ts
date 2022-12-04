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
import { FACTORY, USDCX } from 'data/constants';
import { Factory } from 'abis';
import { useEffect } from 'react';

interface Props {
  targetStreamManager: String;
}

const useContractSet = (targetUser: String) => {

  const factoryContract = {
    address: FACTORY,
    abi: Factory,
  }
  let streamManager, socialToken, stakingContractAddress, other, contractSet;

  useEffect(() => {
    const { data: userContracts } = useContractReads({
      contracts: [
        {
          ...factoryContract,
          functionName: 'creatorSet',
          args: [targetUser] //here should be using the stream manager address instead
        }
      ]
    }, [targetUser]);
    
    if(userContracts != undefined && userContracts[0] != null) {
      console.log(userContracts);
      [streamManager, socialToken, stakingContractAddress, ...other] = userContracts?.[0];
      contractSet = userContracts?.[0];
    }
    contractSet = {
      streamManager,
      socialToken,
      stakingContractAddress
    }
  });
  
  return contractSet;
};
export default useContractSet;
