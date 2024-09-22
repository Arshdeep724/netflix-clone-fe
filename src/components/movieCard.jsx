import { useState } from "react";
import Image from "next/image";
import MovieModal from "./movieModal";

export default function MovieCard({ movie }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="relative w-[200px] h-[300px] rounded-md overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative w-[200px] h-[300px] rounded-md overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
          {imageLoading && (
            <div className="absolute inset-0 bg-netflix-black flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={movie.poster_path}
            alt={movie.title}
            layout="fill"
            objectFit="cover"
            onLoadingComplete={() => setImageLoading(false)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <h3 className="text-netflix-white p-4 text-lg font-semibold">
              {movie.title}
            </h3>
          </div>
        </div>
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="object-cover w-full h-full"
        />
      </div>

      {isModalOpen && (
        <MovieModal movie={movie} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
