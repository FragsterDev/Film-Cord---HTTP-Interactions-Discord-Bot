const { InteractionResponseType } = require("discord-interactions");

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

const wishlistCommandData = {
  type: 1,
  name: "wishlist",
  description: "Manage your wishlist movies and TV shows.",
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
      description: "View another user's wishlist",
      type: 6,
      required: false,
    },
  ],
};

async function execute(interaction) {
  handleWishlist(interaction);

  return {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  };
}

async function handleWishlist(interaction) {
  const options = Object.fromEntries(
    interaction.data.options.map((opt) => [opt.name, opt.value])
  );

  const action = options.action;
  const itemType = options.media;
  const tmdbId = options.id;

  const requester = interaction.member?.user || interaction.user;
  const targetUserId = options.user ?? requester.id;

  const user = await createUserIfNotExists(
    requester.username,
    Number(targetUserId)
  );

  /* ───────────── VIEW ───────────── */
  if (action === "view") {
    const items = await getListItems(user.id, "wishlist", itemType);

    const page = 1;
    const totalPages = Math.max(1, Math.ceil(items.length / 10));
    const pageItems = items.slice(0, 10);

    const embed = listEmbedBuilder({
      username: requester.username,
      listType: "wishlist",
      itemType,
      items: pageItems,
      page,
      totalPages,
    });

    const query = `wishlist|${itemType}|${user.id}`;
    const buttons = paginationButtons(
      "wishlist",
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

  if (!tmdbId) {
    return sendEphemeralResponse(interaction, {
      content: "❌ TMDB ID is required for add/remove.",
      flags: 64,
    });
  }

  if (action === "add") {
    const result = await addListItem(
      user.id,
      itemType,
      tmdbId,
      "Unknown title",
      null,
      "wishlist"
    );

    return sendEphemeralResponse(interaction, {
      content: result
        ? "✅ Added to wishlist."
        : "⚠️ Already exists in wishlist.",
      flags: 64,
    });
  }

  if (action === "remove") {
    const removed = await removeListItem(user.id, "wishlist", itemType, tmdbId);

    return sendEphemeralResponse(interaction, {
      content: removed
        ? "🗑️ Removed from wishlist."
        : "⚠️ Item not found in wishlist.",
      flags: 64,
    });
  }
}

module.exports = {
  data: wishlistCommandData,
  execute,
};
