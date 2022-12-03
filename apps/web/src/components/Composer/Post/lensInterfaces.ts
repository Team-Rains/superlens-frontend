export interface CreatePublicSetProfileMetadataUriRequest {
  metadata: any;
  profileId: any;
}

export interface UpdateProfileImageRequest {
  nftData?: any;
  profileId: any;
  url?: any;
}

export interface CreatePublicPostRequest { 
  collectModule: any; 
  contentURI: any; 
  profileId: any; 
  referenceModule?: any; 
}

export interface CreateMirrorRequest { 
  publicationId: any; 
  profileId: any; 
  referenceModule?: any; 
}