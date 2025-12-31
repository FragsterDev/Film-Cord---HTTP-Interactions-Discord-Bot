const { InteractionResponseType } = require("discord-interactions");

const {
  handleMoviePagination,
  handleTVPagination,
} = require("../pagination_handlers/handle_pagination.js");

const {
  createUserIfNotExists,
  addListItem,
} = require("../../data/repository/user_repository.js");

const sendEphmeralResponse = require("../interaction_response/ephmeral_response/send_ephmeral_response.js");

async function handleButtonEvent(interaction) {
  // 1️⃣ ACK IMMEDIATELY (required)
  await fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
      }),
    }
  );

  const userObj = interaction.member?.user || interaction.user;
  const clickerId = userObj.id;

  // Split ONCE
  const parts = interaction.data.custom_id.split(":");
  const buttonType = parts[0];

  // ───────────── PAGINATION ─────────────
  if (buttonType === "pagination") {
    const [, mediaType, query, page, ownerId] = parts;

    if (ownerId !== clickerId) return;

    const pageNumber = Number(page);

    if (mediaType === "movie") {
      await handleMoviePagination(
        interaction,
        mediaType,
        query,
        pageNumber,
        ownerId
      );
      return;
    }

    if (mediaType === "tv") {
      await handleTVPagination(
        interaction,
        mediaType,
        query,
        pageNumber,
        ownerId
      );
      return;
    }
  }

  // ───────────── LIST BUTTONS ─────────────
  if (buttonType === "list") {
    const [, list_type, item_type, title, year, tmdb_id, owner_id] = parts;

    // 🔒 Only owner can click
    if (owner_id !== clickerId) return;

    // Ensure user exists
    const user = await createUserIfNotExists(
      userObj.username,
      Number(owner_id)
    );

    // Insert into DB
    const result = await addListItem(
      user.id,
      item_type,
      Number(tmdb_id),
      title,
      Number(year),
      list_type
    );

    const options = {
      content: result
        ? `**${title} (${year})** added to **${list_type}**`
        : `**${title} (${year})** is already in **${list_type}**`,
      flags: 64, // EPHEMERAL
    };

    await sendEphmeralResponse(interaction, options);
    return;
  }
}

module.exports = handleButtonEvent;
