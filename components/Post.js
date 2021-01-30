import dayjs from "dayjs"; // Dayjs date parsing
import Link from "next/link"; // Dynamic routing
import makeBlockie from "ethereum-blockies-base64"; // Ethereum avatar
import relativeTime from "dayjs/plugin/relativeTime"; // Dayjs extension
import styles from "@styles/components/Post.module.scss"; // Component styles

// Extend Dayjs with relative time parsing
dayjs.extend(relativeTime);

export default function Post({
  creatorAddress,
  ownerAddress,
  createdAtTimestamp,
  mimeType,
  contentURI,
  name,
  ...props
}) {
  return (
    <div className={styles.showcase__card} {...props}>
      {/* Showcase card header */}
      <div>
        {/* Post creator */}
        <Link href={`/profile/${creatorAddress}`}>
          <a>
            <img src={makeBlockie(creatorAddress)} alt="Avatar" />
            <span>
              {creatorAddress.substr(0, 5) +
                "..." +
                creatorAddress.slice(creatorAddress.length - 5)}
            </span>
          </a>
        </Link>

        {/* Post time */}
        <span>{dayjs(parseInt(createdAtTimestamp) * 1000).fromNow()}</span>
      </div>

      {/* Showcase card content */}
      <div>
        {mimeType.startsWith("image") ? (
          // If content-type === image, return img component
          <img src={contentURI} alt={name} />
        ) : mimeType.startsWith("text") ? (
          // If content-type === text, inject text
          <span>{contentURI}</span>
        ) : mimeType.startsWith("audio") ? (
          // If content-type === audio, return audio component
          <audio controls>
            <source src={contentURI} type={mimeType} />
          </audio>
        ) : mimeType.startsWith("video") ? (
          // Else, if nothing else, return video component
          <video autoPlay playsInline loop>
            <source src={contentURI} type={mimeType} />
          </video>
        ) : mimeType === "" ? (
          // If no media is uploaded (useful for /create)
          <span className={styles.showcase__unsupported}>
            No media uploaded.
          </span>
        ) : (
          // Else, if unsupported mimeType
          <span className={styles.showcase__unsupported}>
            Unsupported file type ({mimeType}). <br />
            <a href={contentURI} target="_blank" rel="noopener noreferrer">
              Direct link
            </a>
            .
          </span>
        )}
      </div>

      {/* Showcase card footer */}
      <div>
        {/* Metadata: name */}
        <h3>{name}</h3>

        {/* Metadata: Owner */}
        <span>
          Collected by{" "}
          <Link href={`/profile/${ownerAddress}`}>
            <a>
              <span>
                {ownerAddress.substr(0, 5) +
                  "..." +
                  ownerAddress.slice(ownerAddress.length - 5)}
              </span>
              <img src={makeBlockie(ownerAddress)} alt="Avatar" />
            </a>
          </Link>
        </span>
      </div>
    </div>
  );
}
