const { TMDB_API_URL } = require("../../constants/tmdb_api_constants.js");
const { buildTVEntity } = require("../../entities/tv_entity.js");

/**
 * Search TV shows by query
 *
 * @param {string} query
 */
async function searchTVByQuery(query) {
  if (!query) throw new Error("No query was provided");

  const url = new URL(`${TMDB_API_URL}/search/tv`);
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
      `TMDB TV Search Failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get TV show details by ID
 *
 * @param {string|number} id
 */
async function getTVByID(id) {
  if (!id) throw new Error("No TV ID was provided");

  const url = new URL(`${TMDB_API_URL}/tv/${id}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB TV Fetch Failed: ${response.status} ${response.statusText}`
    );
  }

  return buildTVEntity(await response.json());
}

module.exports = {
  searchTVByQuery,
  getTVByID,
};
