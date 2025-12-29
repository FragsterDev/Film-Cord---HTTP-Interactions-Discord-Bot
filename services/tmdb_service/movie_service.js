const { TMDB_API_URL } = require("../../constants/tmdb_api_constants.js");
const { buildMovieEntity } = require("../../entities/movie_entity.js");

/**
 *
 * @param {string} query
 */
async function searchMovieByQuery(query) {
  if (!query) throw new Error("No Query was provided");
  const url = new URL(`${TMDB_API_URL}/search/movie`);
  url.searchParams.set("query", query);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB Search Failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 *
 * @param {string} id
 */
async function getMovieByID(id) {
  if (!id) throw new Error("No movie ID was provided.");

  const url = new URL(`${TMDB_API_URL}/movie/${id}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error in TMDB Search ${response.status} ${response.statusText}`
    );
  }

  return buildMovieEntity(await response.json());
}

module.exports = {
  searchMovieByQuery,
  getMovieByID,
};
