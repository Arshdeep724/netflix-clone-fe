import Head from "next/head";
import Navbar from "./navbar";

export default function Layout({ children, fullPageBackground = false }) {
  return (
    <div
      className={`min-h-screen ${
        fullPageBackground ? "bg-cover bg-center" : "bg-netflix-black"
      } text-white`}
    >
      <Head>
        <title>Netflix Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main
        className={`${
          fullPageBackground
            ? "h-[calc(100vh-64px)]"
            : "container mx-auto px-4 py-8"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
