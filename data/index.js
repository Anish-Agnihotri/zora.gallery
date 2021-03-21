import { GraphQLClient } from "graphql-request"; // GraphQL request client

// Create client
const client = new GraphQLClient(
  // Zora Rinkeby subgraph
  "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1-rinkeby"
);

// Export client
export default client;
