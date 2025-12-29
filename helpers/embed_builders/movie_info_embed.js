function singleMovieEmbedBuilder(movie, interaction) {
  const user = interaction.member?.user || interaction.user;

  return {
    title: movie.title,
    url: `https://www.themoviedb.org/movie/${movie.id}`,

    description: movie.tagline
      ? `*${movie.tagline}*\n\n${movie.overview}`
      : movie.overview,

    color: 0x1abc9c,

    thumbnail: movie.posterUrl ? { url: movie.posterUrl } : undefined,

    image: movie.backdropUrl ? { url: movie.backdropUrl } : undefined,

    fields: [
      {
        name: "Movie ID",
        value: String(movie.id),
        inline: false,
      },
      {
        name: "Rating",
        value: `${movie.rating} / 10 (${movie.voteCount} votes)`,
        inline: false,
      },
      {
        name: "Runtime",
        value: movie.runtime ? `${movie.runtime} minutes` : "N/A",
        inline: false,
      },
      {
        name: "Release Date",
        value: movie.releaseDate || "Unknown",
        inline: false,
      },
      {
        name: "Genres",
        value: movie.genres.length ? movie.genres.join(", ") : "N/A",
        inline: false,
      },
      {
        name: "Language",
        value: movie.language.toUpperCase(),
        inline: false,
      },
      {
        name: "Status",
        value: movie.status,
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

module.exports = singleMovieEmbedBuilder;
