import React, { useEffect, useState } from "react";
import MovieCard from "@/components/movieCard";
import axiosApiInstance from "@/lib/axios.config";
import { API_ROUTES } from "@/constants";
import MovieModal from "@/components/movieModal";
import Layout from "@/components/layout";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const response = await axiosApiInstance.get(API_ROUTES.GET_FAVOURITES);
      setFavourites(response.data);
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
  };

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const handleFavouriteRemoved = () => {
    closeModal();
    fetchFavourites();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-netflix-black text-netflix-white px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Favourites</h1>
        {favourites.length === 0 ? (
          <p className="text-center text-gray-500">No favourites added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {favourites.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleCardClick(movie)}
                className="cursor-pointer"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
        {selectedMovie && isModalOpen && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => {
              setIsModalOpen(false);
            }}
            onFavouriteRemoved={handleFavouriteRemoved}
          />
        )}
      </div>
    </Layout>
  );
};

export default Favourites;
