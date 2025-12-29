const {
  InteractionResponseType,
  InteractionResponseFlags,
} = require("discord-interactions");

const {
  getMovieByID,
  searchMovieByQuery,
} = require("../../services/tmdb_service/movie_service");

const singleMovieEmbedBuilder = require("../../helpers/embed_builders/movie_info_embed");
const searchEmbedBuilder = require("../../helpers/embed_builders/search_embed");
const paginationButtons = require("../../helpers/components/pagination_buttons");
const editOriginalInteraction = require("../../helpers/edit_response/edit_interaction");

const movieCommandData = {
  type: 1,
  name: "movie",
  description: "Search for movies based on their name or ID.",
  options: [
    {
      type: 3,
      name: "title",
      description: "Search movies by their title.",
    },
    {
      type: 3,
      name: "id",
      description: "Search a movie by its ID",
    },
  ],
};

async function execute(interaction) {
  // 1️⃣ Defer immediately
  handleMovieInteraction(interaction);

  return {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  };
}

/**
 * All business logic lives here
 */
async function handleMovieInteraction(interaction) {
  const options = interaction.data.options;

  // No options
  if (!options || options.length === 0) {
    return editOriginalInteraction(interaction, {
      content: "No option was provided.",
      flags: InteractionResponseFlags.EPHEMERAL,
    });
  }

  const optionsMap = Object.fromEntries(
    options.map((opt) => [opt.name, opt.value])
  );

  // ID takes priority
  if (optionsMap.id) {
    const movie = await getMovieByID(optionsMap.id);
    const embed = singleMovieEmbedBuilder(movie, interaction);

    return editOriginalInteraction(interaction, {
      embeds: [embed],
    });
  }

  // Title search
  if (optionsMap.title) {
    const title = optionsMap.title;
    const data = await searchMovieByQuery(title);
    const results = data.results || [];

    if (results.length === 0) {
      return editOriginalInteraction(interaction, {
        content: "No results were found.",
      });
    }

    // Single result
    if (results.length === 1) {
      const movie = await getMovieByID(results[0].id);
      const embed = singleMovieEmbedBuilder(movie, interaction);

      return editOriginalInteraction(interaction, {
        embeds: [embed],
      });
    }

    // Pagination
    const page = 1;
    const totalPages = Math.ceil(results.length / 10);

    const searchEmbed = searchEmbedBuilder(results, title, page, totalPages);

    const ownerId = interaction.member?.user?.id || interaction.user?.id;

    const buttons = paginationButtons(
      "movie",
      title,
      page,
      totalPages,
      ownerId
    );

    return editOriginalInteraction(interaction, {
      embeds: [searchEmbed],
      components: [
        {
          type: 1,
          components: buttons,
        },
      ],
    });
  }
}

module.exports = {
  data: movieCommandData,
  execute,
};
