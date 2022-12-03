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


const useLensGated = () => {

  const currentProfile = useAppStore((state) => state.currentProfile);

  const uploadMetadataHandler = async (data: EncryptedMetadata): Promise<string> => {
    console.log('Uploading this data to Arweave ', data);
    const id = await uploadToArweave(data);
    return Promise.resolve(id);
  };

  const nftAccessCondition: NftOwnership = {
    contractAddress: '0xedDbE4435B941fE384CB712320ea966D19b9Ae2a',
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

    await sdk.connect({
      address: currentProfile?.ownedBy,
      env: LensEnvironment.Mumbai
    });

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
    return {contentURI, encryptedMetadata}
  };

  return {
    encryptPostMetadata: encryptPostMetadata
  }
};
export default useLensGated;
