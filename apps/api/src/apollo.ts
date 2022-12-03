import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { API_URL } from 'data/constants';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: API_URL,
  fetchOptions: 'no-cors',
  fetch
});

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem("accessToken");
  console.log("Authentication token", token);
  return {
    headers: {
      ...headers,
      'x-access-token': token ? `Bearer ${token}` : "",
    }
  }
})


const client = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache({})
});

export default client;
