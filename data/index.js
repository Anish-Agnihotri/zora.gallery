import { GraphQLClient } from "graphql-request"; // GraphQL request client

// Create client
const client = new GraphQLClient(
  // Zora mainnet subgraph
  "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1"
);

// Export client
export default client;
