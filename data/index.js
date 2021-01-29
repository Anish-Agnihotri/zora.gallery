import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1"
);

export default client;
