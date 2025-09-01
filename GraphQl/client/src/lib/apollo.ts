import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const uri = import.meta.env.VITE_GQL_URL || 'http://localhost:8000/graphql';

export const apollo = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache(),
});
