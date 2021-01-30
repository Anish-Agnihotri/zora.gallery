import client from "data"; // GraphQL client
import dayjs from "dayjs"; // Dayjs date parsing
import Layout from "@components/Layout"; // Layout
import { useState, useEffect } from "react"; // React state management
import { getPostByID } from "data/functions"; // Post collection helper
import styles from "@styles/Home.module.scss"; // Component styles
import makeBlockie from "ethereum-blockies-base64"; // Ethereum avatar
import relativeTime from "dayjs/plugin/relativeTime"; // Dayjs extension
import { calculateLatestCreation, ZORA_CREATIONS_BY_USER } from "data/queries"; // queries

// Extend Dayjs with relative time parsing
dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState([]); // Posts array
  const [loading, setLoading] = useState(false); // Button loading state
  const [numPosts, setNumPosts] = useState(null); // Number of loadable posts

  /**
   * Collects initial 6 posts to display
   */
  const collectInitialPosts = async () => {
    // Collect all users
    const allUsers = await client.request(ZORA_CREATIONS_BY_USER);
    // Collect number of total posts
    const numPosts = calculateLatestCreation(allUsers);

    let initialPosts = [];
    if (numPosts) {
      // For numPosts ... numPosts - 6
      for (let i = numPosts; i >= numPosts - 5; i--) {
        // Collect post
        const post = await getPostByID(i);
        // Push post to initialPosts
        initialPosts.push(post);
      }
    }

    setPosts([...initialPosts]); // Update new posts
    setNumPosts(numPosts - 6); // Update number of loadable posts count
  };

  /**
   * Collects more posts (6 at a time, unless < 6 remaining posts)
   */
  const collectMore = async () => {
    setLoading(true); // Toggle button loading

    let newPosts = [];
    console.log(Math.max(numPosts - 5, 0), numPosts);
    // For numPosts ... max(numPosts - 6, 0)
    for (let i = numPosts; i >= Math.max(numPosts - 5, 0); i--) {
      // FIXME: hardcoded fix for /dev/null lmao
      if (i !== 2) {
        // Collect post
        const post = await getPostByID(i);
        // Push post to newPosts
        newPosts.push(post);
      }
    }

    setPosts([...posts, ...newPosts]); // Append newPosts to posts array
    setNumPosts(numPosts - 6); // Update number of loadable posts count
    setLoading(false); // Toggle button loading
  };

  // Collect initial posts on load
  useEffect(collectInitialPosts, []);

  return (
    <Layout>
      {posts.length > 0 ? (
        // If posts array contains > 0 posts
        <>
          <div className={styles.showcase}>
            {posts.map((post, i) => {
              // For each Zora post
              return (
                <div className={styles.showcase__card} key={i}>
                  {/* Showcase card header */}
                  <div>
                    {/* Post creator */}
                    <a
                      href={`https://etherscan.io/address/${post.creator.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={makeBlockie(post.creator.id)} alt="Avatar" />
                      <span>
                        {post.creator.id.substr(0, 5) +
                          "..." +
                          post.creator.id.slice(post.creator.id.length - 5)}
                      </span>
                    </a>

                    {/* Post time */}
                    <span>
                      {dayjs(
                        parseInt(post.createdAtTimestamp) * 1000
                      ).fromNow()}
                    </span>
                  </div>

                  {/* Showcase card content */}
                  <div>
                    {post.metadata.mimeType.startsWith("image") ? (
                      // If content-type === image, return img component
                      <img src={post.contentURI} alt={post.metadata.name} />
                    ) : post.metadata.mimeType.startsWith("text") ? (
                      // If content-type === text, inject text
                      <span>{post.contentURI}</span>
                    ) : post.metadata.mimeType.startsWith("audio") ? (
                      // If content-type === audio, return audio component
                      <audio controls>
                        <source
                          src={post.contentURI}
                          type={post.metadata.mimeType}
                        />
                      </audio>
                    ) : (
                      // Else, if nothing else, return video component
                      <video autoPlay playsInline loop>
                        <source
                          src={post.contentURI}
                          type={post.metadata.mimeType}
                        />
                      </video>
                    )}
                  </div>

                  {/* Showcase card footer */}
                  <div>
                    {/* Metadata: name */}
                    <h3>{post.metadata.name}</h3>

                    {/* Metadata: Owner */}
                    <span>
                      Collected by{" "}
                      <a
                        href={`https://etherscan.io/address/${post.owner.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>
                          {post.owner.id.substr(0, 5) +
                            "..." +
                            post.owner.id.slice(post.owner.id.length - 5)}
                        </span>
                        <img src={makeBlockie(post.owner.id)} alt="Avatar" />
                      </a>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {posts && posts.length > 0 && posts[posts.length - 1].id !== "0" ? (
            // If there remain posts that can be loaded, display button
            <div className={styles.showcase__more}>
              <button onClick={() => collectMore()} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          ) : (
            // Else, display text signalling (end, beginning)
            <div className={styles.showcase__more}>
              <span>Is this the end or beginning? You decide.</span>
            </div>
          )}
        </>
      ) : (
        // Else, display loading state
        <div className={styles.loading}>
          <h3>Loading...</h3>
        </div>
      )}
    </Layout>
  );
}
