function paginationButtons(type, query, page, totalPages, userID) {
  return [
    {
      type: 2,
      label: "Prev",
      style: 2,
      custom_id: `pagination:${type}:${query}:${page - 1}:${userID}`,
      disabled: page <= 1,
    },
    {
      type: 2,
      label: "Next",
      style: 2,
      custom_id: `pagination:${type}:${query}:${page + 1}:${userID}`,
      disabled: page >= totalPages,
    },
  ];
}

module.exports = paginationButtons;
