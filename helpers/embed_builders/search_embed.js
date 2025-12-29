function searchEmbedBuilder(results, query, page, totalPages) {
  const startIndex = (page - 1) * 10;
  const pageResults = results.slice(startIndex, startIndex + 10);

  const description = pageResults
    .map((item, index) => {
      const title = item.title || item.name || "Unknown title";
      const date = item.release_date || item.first_air_date;
      const year = date ? date.split("-")[0] : "N/A";

      return `${startIndex + index + 1}. **${title}** (${year}) — ID: \`${
        item.id
      }\``;
    })
    .join("\n");

  return {
    title: `Search results for "${query}"`,
    description: description || "No results found.",
    color: 0x1abc9c,
    footer: {
      text: `Page ${page} / ${totalPages} • use /movie or /tv to search with id`,
    },
  };
}

module.exports = searchEmbedBuilder;
