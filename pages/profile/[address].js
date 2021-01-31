import Head from "next/head"; // Head meta
import client from "@data/index"; // GraphQL client
import Post from "@components/Post"; // Post component
import Layout from "@components/Layout"; // Layout wrapper
import { useState, useEffect } from "react"; // State management
import { getPostByID } from "@data/functions"; // Post retrieval function
import makeBlockie from "ethereum-blockies-base64"; // Ethereum avatar
import { ZORA_MEDIA_BY_OWNER } from "@data/queries"; // Retrieval query
import styles from "@styles/pages/Profile.module.scss"; // Component styles

export default function Profile({ address }) {
  const [posts, setPosts] = useState([]); // Posts array
  const [loading, setLoading] = useState(true); // Global loading state

  /**
   * Collect owned media by address on load
   */
  const collectOwnedMedia = async () => {
    // Collect all postIDs by owner
    const allPosts = await client.request(
      ZORA_MEDIA_BY_OWNER(address.toLowerCase())
    );

    let ownedMedia = [];
    // For all owned posts
    for (let i = 0; i < allPosts.medias.length; i++) {
      // Colelct postID
      const postID = allPosts.medias[i].id;

      // FIXME: hardcoded fix for /dev/null lmao
      if (postID !== "2") {
        // Collect post
        const post = await getPostByID(allPosts.medias[i].id);
        // Push post to ownedMedia
        ownedMedia.push(post);
      }
    }

    setPosts([...ownedMedia.reverse()]); // Update owned posts (reversed for newest first)
    setLoading(false); // Toggle loading
  };

  // Collect owned media on load
  useEffect(collectOwnedMedia, [address]);

  return (
    <Layout>
      <Head>
        {/* Custom meta for profile */}
        <meta
          property="og:image"
          content={`https://zora.gallery/api/meta/profile?address=${address}`}
        />
        <meta
          property="twitter:image"
          content={`https://zora.gallery/api/meta/profile?address=${address}`}
        />
      </Head>

      <div className={styles.profile}>
        {/* Profile header */}
        <div className={styles.profile__head}>
          {/* Avatar */}
          <img src={makeBlockie(address)} alt="Avatar" />

          {/* Name/Address */}
          <h3>{address.toLowerCase()}</h3>

          {/* Etherscan link */}
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Etherscan
          </a>
        </div>
      </div>

      {loading ? (
        // If loading state, show loading
        <div className={styles.profile__media_empty}>
          <span>Loading...</span>
        </div>
      ) : posts.length > 0 ? (
        // Else if, post count > 0
        <div className={styles.profile__media}>
          {posts.map((post, i) => {
            // For each Zora post
            return (
              // Return Post component
              <Post
                key={i}
                creatorAddress={post.creator.id}
                ownerAddress={post.owner.id}
                createdAtTimestamp={post.createdAtTimestamp}
                mimeType={post.metadata.mimeType}
                contentURI={post.contentURI}
                name={post.metadata.name}
              />
            );
          })}
        </div>
      ) : (
        // Else, if not loading and post count !> 0, return no owned media
        <div className={styles.profile__media_empty}>
          <span>No owned media.</span>
        </div>
      )}
    </Layout>
  );
}

// Run on page load
export async function getServerSideProps({ params }) {
  // Return address
  return {
    // As prop
    props: {
      address: params.address,
    },
  };
}
