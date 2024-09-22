import { useState, useEffect } from "react";
import Layout from "../components/layout";
import MovieRow from "../components/movieRow";
import axiosApiInstance from "@/lib/axios.config";
import { API_ROUTES } from "@/constants";
import { useError } from "@/components/errorContext";

export default function Home() {
  const { showError } = useError();
  const [categories, setCategories] = useState({
    nowPlayingMovies: { title: "Now Playing", movies: [] },
    popularMovies: { title: "Popular on Netflix", movies: [] },
    topRatedMovies: { title: "Top Rated", movies: [] },
    upcomingMovies: { title: "Upcoming", movies: [] },
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (currentPage) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosApiInstance.get(
        `${API_ROUTES.GET_MOVIES}?page=${currentPage}`
      );
      const newMovies = response.data;

      setCategories((prev) => {
        const updatedCategories = { ...prev };
        Object.keys(newMovies).forEach((key) => {
          updatedCategories[key].movies = [
            ...prev[key].movies,
            ...newMovies[key],
          ];
        });
        return updatedCategories;
      });

      setPage(currentPage);
      setHasMore(
        Object.values(newMovies).some((category) => category.length > 0)
      );
    } catch (error) {
      console.error("Error fetching movies:", error);
      showError(error.response?.data?.message || "Error fetching movies");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const loadMore = () => {
    fetchMovies(page + 1);
  };

  return (
    <Layout>
      <main className="pb-8">
        {categories.popularMovies.movies.length > 0 && (
          <div className="relative h-[56.25vw] mb-8">
            <img
              src={categories.popularMovies.movies[0].backdrop_path}
              alt={categories.popularMovies.movies[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-netflix-black to-transparent w-full">
              <h1 className="text-5xl font-bold text-netflix-white mb-4">
                {categories.popularMovies.movies[0].title}
              </h1>
              <p className="text-lg text-netflix-white mb-4 max-w-2xl">
                {categories.popularMovies.movies[0].overview}
              </p>
              <button className="bg-netflix-white text-netflix-black px-6 py-2 rounded font-bold hover:bg-opacity-80 transition">
                Play
              </button>
            </div>
          </div>
        )}

        {Object.entries(categories).map(([key, category]) => (
          <MovieRow
            key={key}
            title={category.title}
            movies={category.movies}
            loadMore={loadMore}
          />
        ))}

        {loading && (
          <div className="text-center text-netflix-white">Loading...</div>
        )}
        {!hasMore && (
          <div className="text-center text-netflix-white">
            No more movies to load
          </div>
        )}
      </main>
    </Layout>
  );
}
