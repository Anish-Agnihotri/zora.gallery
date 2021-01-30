import { gql } from "graphql-request"; // graphql query language

// Collect all users and creation ids
export const ZORA_CREATIONS_BY_USER = gql`
  {
    users {
      creations {
        id
      }
    }
  }
`;

/**
 * Returns gql query to retrieve specific Zora post
 * @param {Number} id post infromation to retrieve
 * @returns {gql} query with template string embedded
 */
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

/**
 * Returns gql query to retrieve all Zora posts by owner
 * @param {String} owner address
 * @returns {gql} query with template string embedded
 */
export const ZORA_MEDIA_BY_OWNER = (owner) => {
  return gql`
    {
      medias(where: { owner: "${owner}" }) {
        id
        owner {
          id
        }
        creator {
          id
        }
        contentURI
        metadataURI
        createdAtTimestamp
      }
    }
  `;
};

/**
 * Calculates maximum number of Zora media items
 * @param {Object[]} users
 * @returns {Number} max number of Zora media items
 */
export const calculateLatestCreation = (users) => {
  // Collect all users
  const allUsers = users.users;
  let allCreationIDs = [];

  // For each user
  for (const user of allUsers) {
    // If user has creations
    if (user.creations && user.creations.length > 0) {
      // For each creation
      for (const creation of user.creations) {
        // Push creation ID (cast to int) to allCreationIDs
        allCreationIDs.push(parseInt(creation.id));
      }
    }
  }

  // Return max creation ID
  return Math.max(...allCreationIDs);
};
