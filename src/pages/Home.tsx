import React from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <header className="text-center mb-6 w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">
          Priority Queue Study App
        </h1>
        <p className="text-sm sm:text-md md:text-lg mt-2 text-gray-700">
          Ace your exams!
        </p>
      </header>

      <NavLink
        to="/folders"
        className="bg-blue-500 text-white text-sm sm:text-base py-2 px-4 sm:px-6 rounded-full hover:bg-blue-600 transition duration-300"
      >
        Go to Folders
      </NavLink>
    </div>
  );
}
