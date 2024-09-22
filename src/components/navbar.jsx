import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const getLinkClass = (path) =>
    router.pathname === path ? "text-white font-bold" : "text-netflix-white";

  return (
    <nav className="bg-netflix-black py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="mr-6">
            <Image
              src="/netflix-logo.svg"
              alt="Netflix"
              width={92}
              height={25}
              priority
            />
          </Link>

          <Link href="/" className={`${getLinkClass("/")} mr-4`}>
            Home
          </Link>
          <Link
            href="/favourites"
            className={`${getLinkClass("/favourites")} mr-4`}
          >
            Favourites
          </Link>
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="bg-netflix-red text-netflix-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className={`${getLinkClass("/login")} hover:text-gray-300 mr-4`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-netflix-red text-netflix-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
