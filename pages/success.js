import Link from "next/link"; // Dynamic routing
import Layout from "@components/Layout"; // Layout wrapper
import styles from "@styles/pages/Success.module.scss"; // Component styles

export default function Success() {
  return (
    <Layout>
      <div className={styles.success}>
        {/* Success content */}
        <h2>Success!</h2>
        <p>
          Your media has been minted, although it may take a few more minutes
          for the necessary confirmations and for it to propogate.
        </p>
        <p>You should see it on Home and in your Profile soon!</p>

        {/* Redirec to home */}
        <Link href="/">
          <a>Back Home</a>
        </Link>
      </div>
    </Layout>
  );
}
