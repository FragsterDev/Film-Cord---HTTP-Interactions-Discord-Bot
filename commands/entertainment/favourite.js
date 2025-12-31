const {
  InteractionResponseType,
  InteractionResponseFlags,
} = require("discord-interactions");

const {
  createUserIfNotExists,
  addListItem,
  removeListItem,
  getListItems,
} = require("../../data/repository/user_repository.js");

const listEmbedBuilder = require("../../helpers/embed_builders/list_embed.js");
const paginationButtons = require("../../ui/components/pagination_buttons.js");
const editOriginalInteraction = require("../../helpers/interaction_response/edit_response/edit_interaction.js");
const sendEphemeralResponse = require("../../helpers/interaction_response/ephmeral_response/send_ephmeral_response.js");

const favouriteCommandData = {
  type: 1,
  name: "favourite",
  description: "Manage your favourite movies and TV shows.",
  options: [
    {
      name: "action",
      description: "What do you want to do?",
      type: 3,
      required: true,
      choices: [
        { name: "view", value: "view" },
        { name: "add", value: "add" },
        { name: "remove", value: "remove" },
      ],
    },
    {
      name: "media",
      description: "Movie or TV show",
      type: 3,
      required: true,
      choices: [
        { name: "movie", value: "movie" },
        { name: "tv", value: "tv" },
      ],
    },
    {
      name: "id",
      description: "TMDB ID (required for add/remove)",
      type: 4,
      required: false,
    },
    {
      name: "user",
      description: "View another user's favourites",
      type: 6,
      required: false,
    },
  ],
};

async function execute(interaction) {
  handleFavourite(interaction);

  return {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  };
}

async function handleFavourite(interaction) {
  const options = Object.fromEntries(
    interaction.data.options.map((opt) => [opt.name, opt.value])
  );

  const action = options.action;
  const itemType = options.media;
  const tmdbId = options.id;

  const requester = interaction.member?.user || interaction.user;
  const targetUserId = options.user ?? requester.id;

  // Ensure DB user exists
  const user = await createUserIfNotExists(
    requester.username,
    Number(targetUserId)
  );

  /* ───────────── VIEW ───────────── */
  if (action === "view") {
    const items = await getListItems(user.id, "favorite", itemType);

    const page = 1;
    const totalPages = Math.max(1, Math.ceil(items.length / 10));
    const pageItems = items.slice(0, 10);

    const embed = listEmbedBuilder({
      username: requester.username,
      listType: "favorite",
      itemType,
      items: pageItems,
      page,
      totalPages,
    });

    const query = `favorite|${itemType}|${user.id}`;
    const buttons = paginationButtons(
      "favourite",
      query,
      page,
      totalPages,
      requester.id
    );

    return editOriginalInteraction(interaction, {
      embeds: [embed],
      components: [
        {
          type: 1,
          components: buttons,
        },
      ],
    });
  }

  /* ───────────── ADD / REMOVE VALIDATION ───────────── */
  if (!tmdbId) {
    return sendEphemeralResponse(interaction, {
      content: "❌ TMDB ID is required for add/remove.",
      flags: 64,
    });
  }

  /* ───────────── ADD ───────────── */
  if (action === "add") {
    const result = await addListItem(
      user.id,
      itemType,
      tmdbId,
      "Unknown title",
      null,
      "favorite"
    );

    return sendEphemeralResponse(interaction, {
      content: result
        ? "✅ Added to favourites."
        : "⚠️ Already exists in favourites.",
      flags: 64,
    });
  }

  /* ───────────── REMOVE ───────────── */
  if (action === "remove") {
    const removed = await removeListItem(user.id, "favorite", itemType, tmdbId);

    return sendEphemeralResponse(interaction, {
      content: removed
        ? "🗑️ Removed from favourites."
        : "⚠️ Item not found in favourites.",
      flags: 64,
    });
  }
}

module.exports = {
  data: favouriteCommandData,
  execute,
};
