function singleTVEmbedBuilder(tv, interaction) {
  const user = interaction.member?.user || interaction.user;

  return {
    title: tv.name,
    url: `https://www.themoviedb.org/tv/${tv.id}`,

    description: tv.tagline ? `*${tv.tagline}*\n\n${tv.overview}` : tv.overview,

    color: 0x1abc9c,

    thumbnail: tv.posterUrl ? { url: tv.posterUrl } : undefined,

    image: tv.backdropUrl ? { url: tv.backdropUrl } : undefined,

    fields: [
      {
        name: "TV ID",
        value: String(tv.id),
        inline: false,
      },
      {
        name: "Rating",
        value: `${tv.rating} / 10 (${tv.voteCount} votes)`,
        inline: false,
      },
      {
        name: "First Air Date",
        value: tv.firstAirDate || "Unknown",
        inline: false,
      },
      {
        name: "Last Air Date",
        value: tv.lastAirDate || "Ongoing",
        inline: false,
      },
      {
        name: "Seasons",
        value: String(tv.numberOfSeasons),
        inline: false,
      },
      {
        name: "Episodes",
        value: String(tv.numberOfEpisodes),
        inline: false,
      },
      {
        name: "Genres",
        value: tv.genres.length ? tv.genres.join(", ") : "N/A",
        inline: false,
      },
      {
        name: "Networks",
        value: tv.networks.length ? tv.networks.join(", ") : "N/A",
        inline: false,
      },
      {
        name: "Language",
        value: tv.language.toUpperCase(),
        inline: false,
      },
      {
        name: "Status",
        value: tv.status,
        inline: false,
      },
    ],

    footer: {
      text: `Requested by ${user.username}`,
      icon_url: user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : undefined,
    },

    timestamp: new Date().toISOString(),
  };
}

module.exports = singleTVEmbedBuilder;
