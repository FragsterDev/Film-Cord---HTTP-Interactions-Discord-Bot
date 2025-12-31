const {
  searchMovieByQuery,
} = require("../../services/tmdb_service/movie_service");
const { searchTVByQuery } = require("../../services/tmdb_service/tv_service");

const { getListItems } = require("../../data/repository/user_repository.js");

const paginationButtons = require("../../ui/components/pagination_buttons");
const editOriginalInteraction = require("../interaction_response/edit_response/edit_interaction");
const searchEmbedBuilder = require("../embed_builders/search_embed");
const listEmbedBuilder = require("../embed_builders/list_embed");

/* ───────────────── MOVIE SEARCH ───────────────── */
async function handleMoviePagination(interaction, type, query, page, ownerId) {
  const data = await searchMovieByQuery(query);
  const items = data.results || [];

  const totalPages = Math.ceil(items.length / 10);
  const searchEmbed = searchEmbedBuilder(items, query, page, totalPages);

  const buttons = paginationButtons(type, query, page, totalPages, ownerId);

  return editOriginalInteraction(interaction, {
    embeds: [searchEmbed],
    components: [{ type: 1, components: buttons }],
  });
}

/* ───────────────── TV SEARCH ───────────────── */
async function handleTVPagination(interaction, type, query, page, ownerId) {
  const data = await searchTVByQuery(query);
  const items = data.results || [];

  const totalPages = Math.ceil(items.length / 10);
  const searchEmbed = searchEmbedBuilder(items, query, page, totalPages);

  const buttons = paginationButtons(type, query, page, totalPages, ownerId);

  return editOriginalInteraction(interaction, {
    embeds: [searchEmbed],
    components: [{ type: 1, components: buttons }],
  });
}

/* ───────────────── LIST PAGINATION ───────────────── */
async function handleListPagination(interaction, type, query, page, ownerId) {
  // query format → listType:itemType:userId
  const [listType, itemType, userId] = query.split("|");

  const items = await getListItems(Number(userId), listType, itemType);

  const totalPages = Math.max(1, Math.ceil(items.length / 10));
  const start = (page - 1) * 10;
  const pageItems = items.slice(start, start + 10);

  const embed = listEmbedBuilder({
    username: interaction.member?.user?.username || interaction.user.username,
    listType,
    itemType,
    items: pageItems,
    page,
    totalPages,
  });

  const buttons = paginationButtons(type, query, page, totalPages, ownerId);

  return editOriginalInteraction(interaction, {
    embeds: [embed],
    components: [{ type: 1, components: buttons }],
  });
}

module.exports = {
  handleMoviePagination,
  handleTVPagination,
  handleListPagination,
};
