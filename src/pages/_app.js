import { ErrorProvider } from "@/components/errorContext";
import ErrorPopup from "@/components/errorPopup";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ErrorProvider>
        <ErrorPopup />
        <Component {...pageProps} />
    </ErrorProvider>
  );
}
