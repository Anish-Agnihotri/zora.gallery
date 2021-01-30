import Link from "next/link"; // Dynamic routing
import Head from "next/head"; // HTML Head
import styles from "@styles/Layout.module.scss"; // Component styles

export default function Layout({ children }) {
  return (
    <div>
      {/* Meta */}
      <Meta />

      {/* Header */}
      <Header />

      {/* Content container */}
      <div className={styles.container}>{children}</div>
    </div>
  );
}

// Header
function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.header__logo}>
        {/* Logo */}
        <Link href="/">
          <a>
            <img src="/logo_orb.png" alt="Zora" />
          </a>
        </Link>
      </div>
      <div className={styles.header__menu}>
        <button>Connect Wallet</button>
      </div>
    </div>
  );
}

// Meta
function Meta() {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>Zora Gallery</title>
      <meta name="title" content="Zora Gallery" />
      <meta
        name="description"
        content="Open protocols demand open access. Community-operated interface to ZoraOS."
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://zora.gallery/" />
      <meta property="og:title" content="Zora Gallery" />
      <meta
        property="og:description"
        content="Open protocols demand open access. Community-operated interface to ZoraOS."
      />
      <meta property="og:image" content="https://zora.gallery/meta.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://zora.gallery/" />
      <meta property="twitter:title" content="Zora Gallery" />
      <meta
        property="twitter:description"
        content="Open protocols demand open access. Community-operated interface to ZoraOS."
      />
      <meta property="twitter:image" content="https://zora.gallery/meta.png" />
    </Head>
  );
}
