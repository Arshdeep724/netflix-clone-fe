import { useRef, useEffect, useState } from "react";
import MovieCard from "./movieCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function MovieRow({ title, movies, loadMore }) {
  const rowRef = useRef(null);
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleMovies((prev) => [...prev, entry.target.dataset.movieId]);
        }
      });
    }, options);

    const currentRowRef = rowRef.current;
    if (currentRowRef) {
      currentRowRef.querySelectorAll(".movie-card").forEach((card) => {
        observer.current.observe(card);
      });
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [movies]);

  useEffect(() => {
    const handleScroll = () => {
      if (rowRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);

        if (scrollWidth - scrollLeft - clientWidth < 200) {
          loadMore();
        }
      }
    };

    const currentRowRef = rowRef.current;
    if (currentRowRef) {
      currentRowRef.addEventListener("scroll", handleScroll);
      // Trigger initial check
      handleScroll();
    }

    return () => {
      if (currentRowRef) {
        currentRowRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loadMore]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8 relative group">
      <h2 className="text-2xl font-bold mb-4 text-netflix-white">{title}</h2>
      <div className="relative">
        {showLeftArrow && (
          <button
            className="absolute left-0 top-0 bottom-0 z-10 bg-black bg-opacity-50 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => scroll("left")}
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>
        )}
        <div
          ref={rowRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide scroll-smooth"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none movie-card"
              data-movie-id={movie.id}
            >
              {visibleMovies.includes(movie.id.toString()) && (
                <MovieCard movie={movie} />
              )}
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button
            className="absolute right-0 top-0 bottom-0 z-10 bg-black bg-opacity-50 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => scroll("right")}
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
