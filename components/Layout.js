import Link from "next/link";
import Head from "next/head";
import styles from "@styles/Layout.module.scss";

export default function Layout({ children }) {
  return (
    <div>
      <div className={styles.header}>
        <Link href="/">
          <a>
            <img src="/logo_orb.png" alt="Zora" />
          </a>
        </Link>
        <div>
          <h2>Zora Gallery</h2>
          <p>
            Open protocols demand{" "}
            <a
              href="https://github.com/anish-agnihotri/zora.gallery"
              target="_blank"
              rel="noopener noreferrer"
            >
              open
            </a>{" "}
            access.
          </p>
        </div>
      </div>
      <div className={styles.container}>{children}</div>
    </div>
  );
}

function Meta() {
  return (
    <Head>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
}
