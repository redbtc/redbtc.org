module.exports = {
  flows: [
    {
      type: "doc",
      id: "flows",
    },
    {
      type: "category",
      label: "Starters",
      items: ["starters/invoice-creator", "starters/ipn-handler"],
    },
    {
      type: "category",
      label: "Integrations",
      items: ["integrations/telegram-notifications", "integrations/kraken-exchange"],
    },
    {
      type: "category",
      label: "Applications",
      items: ["applications/telegram-gatekeeper", "applications/github-donations"],
    },
  ],
};
