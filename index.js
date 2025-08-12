const { initializeDatabase } = require("./db/db.connect");
const Movie = require("./models/movie.models");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
initializeDatabase();

async function createMovie(movieData) {
  try {
    const movie = new Movie(movieData);
    const savedMovie = await movie.save();
    console.log("New Movie data:", savedMovie);
    return savedMovie;
  } catch (error) {
    throw error;
  }
}

// POST route to add a movie
app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res.status(201).json({ message: "Movie added successfully.", movie: savedMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" });
  }
});

async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    return movie;
  } catch (error) {
    throw error;
  }
}
app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title); 

    if (movie) {
      res.json(movie); 
    } else {
      res.status(404).json({ error: 'Movie not found.' }); 
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." }); 
  }
});

async function readAllMovies() {
  try {
    const allMovies = await Movie.find();
    return allMovies;
  } catch (error) {
    throw error;
  }
}
app.get("/movies", async (req, res) => {
  try {
    const movies = await readAllMovies(); 

    if (movies.length !== 0) {
      res.json(movies); 
    } else {
      res.status(404).json({ error: 'No movies found.' }); 
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." }); 
  }
});


async function readMovieByDirector(directorName) {
  try {
    const movieByDirector = await Movie.find({ director: directorName });
    return movieByDirector;
  } catch (error) {
    throw error;
  }
}
app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await readMovieByDirector(req.params.directorName);

    if (movies.length !== 0) {
      res.json(movies); // Return movies by the director
    } else {
      res.status(404).json({ error: "No movies found." }); // No matches
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." }); // Internal error
  }
});
const readMovieByGenre = async (genreName) => {
  try {
    const movies = await Movie.find({ genre: genreName });
    return movies;
  } catch (error) {
    console.error("Error in readMovieByGenre:", error);
    throw error;
  }
};
app.get("/movies/genres/:genreName", async (req, res) => {
  try {
    const movies = await readMovieByGenre(req.params.genreName);

    if (movies.length !== 0) {
      res.json(movies); 
    } else {
      res.status(404).json({ error: "No movies found." }); 
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." }); 
  }
});


async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, { new: true });
    return updatedMovie;
  } catch (error) {
    console.log("Error in updating movie by ID:", error.message);
  }
}
app.post("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body);

    if (updatedMovie) {
      res.status(200).json({
        message: "Movie updated successfully.",
        updatedMovie: updatedMovie,
      });
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie." });
  }
});
async function deleteMovie(movieId) {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    return deletedMovie;
  } catch (error) {
    console.log("Error in deleting movie by ID:", error.message);
  }
}
app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId);
    if (deletedMovie) {
      res.status(200).json({ message: "Movie deleted successfully." });
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

