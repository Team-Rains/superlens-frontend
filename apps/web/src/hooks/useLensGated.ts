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
import { FACTORY } from 'data/constants';
import { Factory } from 'abis';

const useLensGated = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const factoryContract = {
    address: FACTORY,
    abi: Factory
  };

  const { data: userContracts } = useContractReads({
    contracts: [
      {
        ...factoryContract,
        functionName: 'creatorSet',
        args: [currentProfile?.ownedBy] 
      }
    ]
  });
  
  const [streamManager, socialToken, stakingContractAddress, ...other] = userContracts?.[0];
  

  console.log("The stream manager address is ", streamManager);

  const uploadMetadataHandler = async (data: EncryptedMetadata): Promise<string> => {
    console.log('Uploading this data to Arweave ', data);
    const id = await uploadToArweave(data);
    return Promise.resolve(id);
  };

  const nftAccessCondition: NftOwnership = {
    contractAddress: streamManager,
    chainID: 80001,
    contractType: ContractType.Erc721
  };

  const encryptPostMetadata = async (metadata: any) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum!);

    const sdk = await LensGatedSDK.create({
      provider: provider,
      signer: provider.getSigner(currentProfile?.ownedBy),
      env: LensEnvironment.Mumbai
    });

    console.log('Created sdk');

    await sdk.connect({
      address: currentProfile?.ownedBy,
      env: LensEnvironment.Mumbai
    });

    console.log('Connected to SDK');

    const { contentURI, encryptedMetadata } = await sdk.gated.encryptMetadata(
      metadata,
      currentProfile?.id,
      {
        nft: nftAccessCondition
      },
      uploadMetadataHandler
    );
    console.log('Content uri is', contentURI);
    console.log(encryptedMetadata);
    return { contentURI, encryptedMetadata };
  };

  const decryptPostMetadata = async (metadata: any): Promise<any> => {
    const provider = new ethers.providers.Web3Provider(window.ethereum!);

    const sdk = await LensGatedSDK.create({
      provider: provider,
      signer: provider.getSigner(currentProfile?.ownedBy),
      env: LensEnvironment.Mumbai
    });

    console.log('Created sdk');

    await sdk.connect({
      address: currentProfile?.ownedBy,
      env: LensEnvironment.Mumbai
    });

    const { error, decrypted } = await sdk.gated.decryptMetadata(metadata);
    console.log('An error occured ', error);
    console.log('Decrypted metadata ', decrypted);
    return Promise.resolve(decrypted);
  };

  return {
    encryptPostMetadata: encryptPostMetadata,
    decryptPostMetadata: decryptPostMetadata,
    nftAccessCondition: nftAccessCondition
  };
};
export default useLensGated;
