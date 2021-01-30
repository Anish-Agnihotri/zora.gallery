import axios from "axios"; // Requests
import client from "data"; // GraphQL requests
import { ZORA_MEDIA_BY_ID } from "@data/queries"; // GraphQL Queries

/**
 * Collect Zora media post by ID
 * @param {Number} id post number
 * @returns {Object} containing Zora media details
 */
export const getPostByID = async (id) => {
  // Collect post
  let post = await client.request(ZORA_MEDIA_BY_ID(id));
  post = post.media;

  // Collect post metadata
  const metadata = await axios.get(post.metadataURI);
  post.metadata = metadata.data;

  // If text media, collect post content
  if (metadata.data.mimeType.startsWith("text")) {
    const text = await axios.get(post.contentURI);
    post.contentURI = text.data;
  }

  // Return post
  return post;
};
