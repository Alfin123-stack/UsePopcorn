import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const apiKey = "cc5bd20f";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("avengers");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedId(movieId) {
    setSelectedId((id) => (id === movieId ? null : movieId));
  }

  function handleCloseDetails() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((prevMovie) => [...prevMovie, movie]);
  }

  function handleDeleteWatchedMovie(movieId) {
    setWatched((prevMovie) => prevMovie.filter((m) => m.imdbID !== movieId));
  }

  useEffect(() => {
    // Define an asynchronous function to fetch movie data
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");
        // Fetch the data from the API
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
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

        console.log("fetchingg");
      } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        console.log("selesai loading");
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setError("");
      setMovies([]);
      return;
    }

    // Call the fetch function
    fetchMovies();
  }, [query]);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieLists movies={movies} onSelectedId={handleSelectedId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseDetails={handleCloseDetails}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
              // key={selectedId}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieLists
                watched={watched}
                onDeletedWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading.....</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>💔</span>
      {message}
    </p>
  );
}

// MAIN
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieLists({ movies, onSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectedId={onSelectedId} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectedId }) {
  return (
    <li onClick={() => onSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function WatchedBox({ children }) {
//
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}>
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieLists watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function MovieDetails({
  selectedId,
  onCloseDetails,
  onAddWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const findWathedMovie = watched.filter(
    (movieWathed) => movieWathed.imdbID === selectedId
  );

  const isWathedMovie = findWathedMovie.length > 0;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAddToWatched() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    // if (isWathedMovie) return onCloseDetails();
    onAddWatchedMovie(newWatchedMovie);
    onCloseDetails();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseDetails}>
              ⬅
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWathedMovie ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleAddToWatched}>
                      + Add To List
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p>You already rated this movie</p>
                  <StarRating
                    maxRating={10}
                    size={24}
                    defaultRating={
                      isWathedMovie ? findWathedMovie[0].userRating : 0
                    }
                    disabled={true}
                  />
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieLists({ watched, onDeletedWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeletedWatchedMovie={onDeletedWatchedMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeletedWatchedMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => onDeletedWatchedMovie(movie.imdbID)}>
        ✖
      </button>
    </li>
  );
}

//  NAVBAR
function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

//  AKHIR NAVBAR
