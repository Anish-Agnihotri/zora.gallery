import "../styles/globals.scss"; // Global styles
import GlobalProvider from "@containers/index";

export default function MyApp({ Component, pageProps }) {
  return (
    // Wrap page in global state provider
    <GlobalProvider>
      <Component {...pageProps} />;
    </GlobalProvider>
  );
}
