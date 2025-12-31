function listEmbedBuilder({
  username,
  listType,
  itemType,
  items,
  page = 1,
  totalPages = 1,
}) {
  const titleMap = {
    favorite: "Favourites",
    watched: "Watched",
    wishlist: "Wishlist",
    watching: "Now Watching",
  };

  const displayTitle = titleMap[listType] || listType;
  const startIndex = (page - 1) * 10;

  const description =
    items.length > 0
      ? items
          .map((item, index) => {
            const year = item.release_year || "N/A";
            return `${startIndex + index + 1}. **${
              item.title
            }** (${year}) — ID: \`${item.tmdb_id}\``;
          })
          .join("\n")
      : "_No items found._";

  return {
    title: `${displayTitle} • ${itemType.toUpperCase()}`,
    description,
    color: 0x1abc9c,
    footer: {
      text: `Requested by ${username} • Page ${page}/${totalPages}`,
    },
    timestamp: new Date().toISOString(),
  };
}

module.exports = listEmbedBuilder;
