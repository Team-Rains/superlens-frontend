import { ethers } from 'ethers';
import {
  ContractType,
  EncryptedMetadata,
  LensEnvironment,
  LensGatedSDK,
  MetadataV2,
  NftOwnership
} from '@lens-protocol/sdk-gated';
import { useAppStore } from 'src/store/app';


const useInitializeLensGate = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  

  const initialiseSDK = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum!);

    const sdk = await LensGatedSDK.create({
      provider: provider,
      signer: provider.getSigner(currentProfile?.ownedBy),
      env: LensEnvironment.Mumbai
    });
  
    console.log("Created sdk");
  
    await sdk.connect({
      address: currentProfile?.ownedBy,
      env: LensEnvironment.Mumbai
    });
  }
  
}
export default useInitializeLensGate;