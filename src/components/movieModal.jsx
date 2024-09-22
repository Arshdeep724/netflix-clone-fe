import { useState, useEffect } from "react";
import axiosApiInstance from "@/lib/axios.config";
import { API_ROUTES } from "@/constants";

const MovieModal = ({ movie, onClose, onFavouriteRemoved }) => {
  const [isFavourite, setIsFavourite] = useState(false);

  const handleToggleFavourite = async () => {
    try {
      const movie_id = movie.id;
      if (isFavourite) {
        await axiosApiInstance.delete(
          `${API_ROUTES.REMOVE_FAVOURITE}/?movie_id=${movie_id}`
        );
        setIsFavourite(false);
        onFavouriteRemoved(); // Call this when a favourite is removed
      } else {
        const body = {
          backdrop_path: movie.backdrop_path,
          movie_id: movie_id,
          original_title: movie.original_title,
          poster_path: movie.poster_path,
          title: movie.title,
          overview: movie.overview,
        };
        await axiosApiInstance.post(API_ROUTES.ADD_FAVOURITE, body);
        setIsFavourite(true);
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-netflix-black text-netflix-white p-6 rounded-lg max-w-3xl w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${movie.backdrop_path})` }}
        ></div>
        <button
          className="absolute top-4 right-4 text-netflix-white text-2xl z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-md"
              />
            </div>
            <div>
              <p className="mb-4">{movie.overview}</p>
              <button
                className={`px-4 py-2 rounded ${
                  isFavourite
                    ? "bg-netflix-red hover:bg-red-600"
                    : "bg-netflix-white text-netflix-black hover:bg-gray-200"
                }`}
                onClick={handleToggleFavourite}
              >
                {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
