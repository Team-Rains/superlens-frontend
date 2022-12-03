import { CreatePublicPostRequest } from 'lens';
import {CREATE_POST} from './query';
import apolloClient from '../../../apollo';
import { gql } from '@apollo/client'

export const createNewPost = async (request: CreatePublicPostRequest) => {
  return await apolloClient.mutate({
    mutation: gql(CREATE_POST),
    variables: {
      request,
    },
  });
};
