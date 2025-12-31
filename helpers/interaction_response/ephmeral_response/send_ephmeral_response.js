async function sendEphmeralResponse(interaction, options) {
  await fetch(
    `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${interaction.token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    }
  );
}

module.exports = sendEphmeralResponse;
