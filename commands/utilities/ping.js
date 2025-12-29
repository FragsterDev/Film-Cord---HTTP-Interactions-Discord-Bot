const { InteractionResponseType } = require("discord-interactions");
const os = require("os");
const { version } = require("../../package.json"); // adjust path if needed

const pingCommandData = {
  type: 1,
  name: "ping",
  description: "Check if the bot is alive",
};

const DISCORD_EPOCH = 1420070400000n;

function buildPingEmbed(interaction) {
  const interactionTimestamp = (BigInt(interaction.id) >> 22n) + DISCORD_EPOCH;

  let latency = Number(BigInt(Date.now()) - interactionTimestamp);

  if (latency < 0) latency = Math.abs(latency);

  return {
    title: "Pong 🏓",
    description: "Bot is alive and responding normally.",
    color: 0x57f287,

    // ⏱ Timestamp (shows at bottom-right of embed)
    timestamp: new Date().toISOString(),

    fields: [
      {
        name: "Latency",
        value: `\`${latency} ms\``,
        inline: false,
      },
      {
        name: "Operating System",
        value: `\`${os.platform()} ${os.arch()}\``,
        inline: false,
      },
      {
        name: "Node.js Version",
        value: `\`${process.version}\``,
        inline: false,
      },
      {
        name: "App Version",
        value: `\`v${version}\``,
        inline: false,
      },
      {
        name: "Memory Usage",
        value: `\`${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB\``,
        inline: false,
      },
      {
        name: "Uptime",
        value: `\`${Math.round(process.uptime())} seconds\``,
        inline: false,
      },
      {
        name: "Process ID",
        value: `\`${process.pid}\``,
        inline: false,
      },
    ],
    footer: {
      text: "HTTP interactions",
    },
  };
}

async function execute(interaction) {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [buildPingEmbed(interaction)],
    },
  };
}

module.exports = {
  data: pingCommandData,
  execute,
};
