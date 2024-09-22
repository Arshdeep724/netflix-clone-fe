import React, { useRef, useEffect, useState, useCallback } from "react";
import MovieCard from "./movieCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function MovieRow({ title, movies, loadMore }) {
  const rowRef = useRef(null);
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const observer = useRef();
  const scrolling = useRef(false);

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setVisibleMovies((prev) => [...prev, entry.target.dataset.movieId]);
      }
    });
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    observer.current = new IntersectionObserver(handleIntersection, options);

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
  }, [handleIntersection, movies]);

  const handleScroll = useCallback(() => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);

      if (scrollWidth - scrollLeft - clientWidth < 200 && !scrolling.current) {
        loadMore();
      }
    }
  }, [loadMore]);

  useEffect(() => {
    const currentRowRef = rowRef.current;
    if (currentRowRef) {
      currentRowRef.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (currentRowRef) {
        currentRowRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const scroll = useCallback(
    (direction) => {
      if (rowRef.current && !scrolling.current) {
        scrolling.current = true;
        const { clientWidth } = rowRef.current;
        const scrollAmount =
          direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
        const start = rowRef.current.scrollLeft;
        const startTime = performance.now();
        const duration = 300;

        const animateScroll = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          if (elapsedTime < duration) {
            const progress = elapsedTime / duration;
            const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
            rowRef.current.scrollLeft = start + scrollAmount * easeProgress;
            requestAnimationFrame(animateScroll);
          } else {
            rowRef.current.scrollLeft = start + scrollAmount;
            scrolling.current = false;
            handleScroll();
          }
        };

        requestAnimationFrame(animateScroll);
      }
    },
    [handleScroll]
  );

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
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
          style={{ scrollBehavior: "auto" }}
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
