import { gql } from "graphql-request";

export const ZORA_CREATIONS_BY_USER = gql`
  {
    users {
      creations {
        id
      }
    }
  }
`;

export const ZORA_MEDIA_BY_ID = (id) => {
  return gql`
  {
    media(id:"${id.toString()}") {
      id,
      owner {
        id
      },
      creator {
        id
      },
      contentURI,
      metadataURI,
      createdAtTimestamp
    }
  }
  `;
};

export const calculateLatestCreation = (users) => {
  const allUsers = users.users;
  let allCreationIDs = [];

  for (const user of allUsers) {
    if (user.creations && user.creations.length > 0) {
      for (const creation of user.creations) {
        allCreationIDs.push(parseInt(creation.id));
      }
    }
  }

  return Math.max(...allCreationIDs);
};
