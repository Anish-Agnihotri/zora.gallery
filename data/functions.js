import axios from "axios";
import client from "data";
import { ZORA_MEDIA_BY_ID } from "data/queries";

/**
 * Collect Zora media post by ID
 * @param {Number} id post number
 * @returns {Object} containing Zora media details
 */
export const getPostByID = async (id) => {
  let post = await client.request(ZORA_MEDIA_BY_ID(id));
  post = post.media;
  const metadata = await axios.get(post.metadataURI);
  post.metadata = metadata.data;

  if (metadata.data.mimeType.startsWith("text")) {
    const text = await axios.get(post.contentURI);
    post.contentURI = text.data;
  }

  return post;
};
