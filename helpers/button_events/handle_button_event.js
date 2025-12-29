const { InteractionResponseType } = require("discord-interactions");

const {
  handleMoviePagination,
  handleTVPagination,
} = require("../pagination_handlers/handle_pagination.js");

async function handleButtonEvent(interaction) {
  // 1️⃣ ACK IMMEDIATELY
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

  const clicker = interaction.member?.user?.id || interaction.user?.id;

  // 2️⃣ Continue work
  const [type, query, page, ownerId] = interaction.data.custom_id.split(":");

  if (ownerId !== clicker) {
    return;
  }

  const pageNumber = Number(page);

  if (type === "movie") {
    await handleMoviePagination(interaction, type, query, pageNumber, ownerId);
  }

  if (type === "tv") {
    await handleTVPagination(interaction, type, query, pageNumber, ownerId);
  }
}

module.exports = handleButtonEvent;
