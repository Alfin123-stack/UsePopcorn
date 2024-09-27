import { useState, useEffect } from "react";

const apiKey = "cc5bd20f";
export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    // Define an asynchronous function to fetch movie data
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");
        // Fetch the data from the API
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
          { signal: controller.signal }
        );

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data from the response
        const data = await response.json();

        if (data.Response === "False") throw new Error("Movie not found");

        // Handle the data
        setMovies(data.Search);

        setError("");
      } catch (error) {
        // Handle any errors that occurred during the fetch

        if (error.name !== "AbortError") {
          console.log("Error fetching data:", error);
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setError("");
      setMovies([]);
      return;
    }

    // handleCloseDetails();

    // Call the fetch function
    fetchMovies();

    // clear request api
    return function () {
      controller.abort();
    };
  }, [query]);

  return { isLoading, error, movies };
}
