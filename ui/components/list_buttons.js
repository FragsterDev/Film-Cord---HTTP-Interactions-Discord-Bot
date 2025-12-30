function listButtons(itemType, title, year, itemId, userId) {
  return [
    {
      type: 2,
      label: "Favourite ❤️",
      style: 1,
      custom_id: `list:favorite:${itemType}:${title}:${year}:${itemId}:${userId}`,
    },
    {
      type: 2,
      label: "Watched 👀",
      style: 2,
      custom_id: `list:watched:${itemType}:${title}:${year}:${itemId}:${userId}`,
    },
    {
      type: 2,
      label: "Wishlist 📌",
      style: 2,
      custom_id: `list:wishlist:${itemType}:${title}:${year}:${itemId}:${userId}`,
    },
    {
      type: 2,
      label: "Now Watching ▶️",
      style: 2,
      custom_id: `list:watching:${itemType}:${title}:${year}:${itemId}:${userId}`,
    },
  ];
}

module.exports = listButtons;
