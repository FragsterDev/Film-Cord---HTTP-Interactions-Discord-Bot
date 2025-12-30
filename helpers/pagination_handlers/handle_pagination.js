const {
  searchMovieByQuery,
} = require("../../services/tmdb_service/movie_service");

const { searchTVByQuery } = require("../../services/tmdb_service/tv_service");

const paginationButtons = require("../../ui/components/pagination_buttons");
const editOriginalInteraction = require("../edit_response/edit_interaction");
const searchEmbedBuilder = require("../embed_builders/search_embed");

/**
 * Movie pagination handler
 */
async function handleMoviePagination(interaction, type, query, page, ownerId) {
  const data = await searchMovieByQuery(query);
  const items = data.results || [];

  const totalPages = Math.ceil(items.length / 10);

  const searchEmbed = searchEmbedBuilder(
    items,
    query,
    Number(page),
    totalPages
  );

  const buttons = paginationButtons(type, query, page, totalPages, ownerId);

  const newMessage = {
    embeds: [searchEmbed],
    components: [
      {
        type: 1,
        components: buttons,
      },
    ],
  };

  return editOriginalInteraction(interaction, newMessage);
}

/**
 * TV pagination handler
 */
async function handleTVPagination(interaction, type, query, page, ownerId) {
  const data = await searchTVByQuery(query);
  const items = data.results || [];

  const totalPages = Math.ceil(items.length / 10);

  const searchEmbed = searchEmbedBuilder(
    items,
    query,
    Number(page),
    totalPages
  );

  const buttons = paginationButtons(type, query, page, totalPages, ownerId);

  const newMessage = {
    embeds: [searchEmbed],
    components: [
      {
        type: 1,
        components: buttons,
      },
    ],
  };

  return editOriginalInteraction(interaction, newMessage);
}

module.exports = {
  handleMoviePagination,
  handleTVPagination,
};
