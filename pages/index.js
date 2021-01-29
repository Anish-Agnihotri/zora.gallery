import styles from "@styles/Home.module.scss";
import Layout from "@components/Layout";
import { calculateLatestCreation, ZORA_CREATIONS_BY_USER } from "data/queries";
import { getPostByID } from "data/functions";
import { useState, useEffect } from "react";
import client from "data";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numPosts, setNumPosts] = useState(null);

  const collectInitialPosts = async () => {
    const allUsers = await client.request(ZORA_CREATIONS_BY_USER);
    const numPosts = calculateLatestCreation(allUsers);

    let initialPosts = [];
    if (numPosts) {
      console.log("Gets here");
      for (let i = numPosts; i >= numPosts - 5; i--) {
        const post = await getPostByID(i);
        console.log(post.metadata.name);
        initialPosts.push(post);
      }
    }

    setPosts([...initialPosts]);
    setNumPosts(numPosts - 6);
    setLoading(false);
  };

  const collectMore = async () => {
    setLoading(true);

    let newPosts = [];

    console.log(Math.max(numPosts - 6, 0), numPosts);
    for (let i = numPosts; i > Math.max(numPosts - 6, 0); i--) {
      const post = await getPostByID(i);
      newPosts.push(post);
    }

    setPosts([...posts, ...newPosts]);
    setNumPosts(numPosts - 6);
    setLoading(false);
  };

  useEffect(() => {
    collectInitialPosts();
  }, []);

  return (
    <Layout>
      {posts.length > 0 ? (
        <>
          <div className={styles.showcase}>
            {posts.map((post, i) => {
              return (
                <div className={styles.showcase__card} key={i}>
                  <div>
                    <a
                      href={`https://etherscan.io/address/${post.creator.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.creator.id.substr(0, 5) +
                        "..." +
                        post.creator.id.slice(post.creator.id.length - 5)}
                    </a>
                    <span>
                      {dayjs(
                        parseInt(post.createdAtTimestamp) * 1000
                      ).fromNow()}
                    </span>
                  </div>
                  <div>
                    {post.metadata.mimeType.startsWith("image") ? (
                      <img src={post.contentURI} alt={post.metadata.name} />
                    ) : post.metadata.mimeType.startsWith("text") ? (
                      <span>{post.contentURI}</span>
                    ) : (
                      <video autoPlay playsInline loop>
                        <source
                          src={post.contentURI}
                          type={post.metadata.mimeType}
                        />
                      </video>
                    )}
                  </div>
                  <div>
                    <h3>{post.metadata.name}</h3>
                    <p>{post.metadata.description}</p>
                    <span>
                      Collected by{" "}
                      <a
                        href={`https://etherscan.io/address/${post.owner.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {post.owner.id.substr(0, 5) +
                          "..." +
                          post.owner.id.slice(post.owner.id.length - 5)}
                      </a>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {posts.length !== numPosts ? (
            <div className={styles.showcase__more}>
              <button onClick={() => collectMore()} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          ) : (
            <span>Is this the end or beginning? You decide.</span>
          )}
        </>
      ) : (
        <span>Loading...</span>
      )}
    </Layout>
  );
}
