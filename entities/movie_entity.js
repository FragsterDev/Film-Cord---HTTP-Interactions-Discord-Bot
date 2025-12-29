/**
 * Movie Entity (Application-level data structure)
 *
 * This is NOT an API response.
 * This is the shape your app understands and uses everywhere.
 */

/**
 * @typedef {Object} MovieEntity
 * @property {number} id
 * @property {string} title
 * @property {string} overview
 * @property {string|null} posterUrl
 * @property {string|null} backdropUrl
 * @property {string} releaseDate
 * @property {number} runtime
 * @property {number} rating
 * @property {number} voteCount
 * @property {string[]} genres
 * @property {string} language
 * @property {string} status
 * @property {string|null} tagline
 */

/**
 * Build a MovieEntity from TMDB API response
 *
 * @param {Object} tmdbMovie
 * @returns {MovieEntity}
 */
function buildMovieEntity(tmdbMovie) {
  if (!tmdbMovie) {
    throw new Error("Invalid TMDB movie data");
  }

  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || tmdbMovie.original_title,
    overview: tmdbMovie.overview,
    posterUrl: tmdbMovie.poster_path
      ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
      : null,
    backdropUrl: tmdbMovie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${tmdbMovie.backdrop_path}`
      : null,
    releaseDate: tmdbMovie.release_date,
    runtime: tmdbMovie.runtime,
    rating: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
    genres: Array.isArray(tmdbMovie.genres)
      ? tmdbMovie.genres.map((g) => g.name)
      : [],
    language: tmdbMovie.original_language,
    status: tmdbMovie.status,
    tagline: tmdbMovie.tagline || null,
  };
}

module.exports = {
  buildMovieEntity,
};
