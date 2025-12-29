/**
 * TV Entity (Application-level data structure)
 *
 * This is NOT the TMDB API response.
 * This is the shape your app understands and uses.
 */

/**
 * @typedef {Object} TVEntity
 * @property {number} id
 * @property {string} name
 * @property {string} overview
 * @property {string|null} posterUrl
 * @property {string|null} backdropUrl
 * @property {string} firstAirDate
 * @property {string|null} lastAirDate
 * @property {number} numberOfSeasons
 * @property {number} numberOfEpisodes
 * @property {number} rating
 * @property {number} voteCount
 * @property {string[]} genres
 * @property {string[]} networks
 * @property {string[]} productionCompanies
 * @property {string[]} productionCountries
 * @property {string[]} spokenLanguages
 * @property {string} language
 * @property {string} status
 * @property {string|null} tagline
 * @property {boolean} inProduction
 */

/**
 * Build a TVEntity from TMDB TV API response
 *
 * @param {Object} tmdbTV
 * @returns {TVEntity}
 */
function buildTVEntity(tmdbTV) {
  if (!tmdbTV) {
    throw new Error("Invalid TMDB TV data");
  }

  return {
    id: tmdbTV.id,
    name: tmdbTV.name || tmdbTV.original_name,
    overview: tmdbTV.overview,

    posterUrl: tmdbTV.poster_path
      ? `https://image.tmdb.org/t/p/w500${tmdbTV.poster_path}`
      : null,

    backdropUrl: tmdbTV.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${tmdbTV.backdrop_path}`
      : null,

    firstAirDate: tmdbTV.first_air_date,
    lastAirDate: tmdbTV.last_air_date ?? null,

    numberOfSeasons: tmdbTV.number_of_seasons,
    numberOfEpisodes: tmdbTV.number_of_episodes,

    rating: tmdbTV.vote_average,
    voteCount: tmdbTV.vote_count,

    genres: Array.isArray(tmdbTV.genres)
      ? tmdbTV.genres.map((g) => g.name)
      : [],

    networks: Array.isArray(tmdbTV.networks)
      ? tmdbTV.networks.map((n) => n.name)
      : [],

    productionCompanies: Array.isArray(tmdbTV.production_companies)
      ? tmdbTV.production_companies.map((c) => c.name)
      : [],

    productionCountries: Array.isArray(tmdbTV.production_countries)
      ? tmdbTV.production_countries.map((c) => c.name)
      : [],

    spokenLanguages: Array.isArray(tmdbTV.spoken_languages)
      ? tmdbTV.spoken_languages.map((l) => l.english_name)
      : [],

    language: tmdbTV.original_language,
    status: tmdbTV.status,
    tagline: tmdbTV.tagline || null,
    inProduction: tmdbTV.in_production,
  };
}

module.exports = {
  buildTVEntity,
};
