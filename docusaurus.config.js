module.exports = {
  title: "Red BTC",
  tagline: "",
  url: "https://redbtc.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "alexk111",
  projectName: "redbtc.org",
  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
    // prism: {
    //   theme: require("prism-react-renderer/themes/github"),
    //   // darkTheme: require('prism-react-renderer/themes/dracula'),
    // },
    navbar: {
      title: "Red BTC",
      logo: {
        alt: "Red BTC Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          to: "flows/",
          activeBasePath: "flows",
          label: "Flows",
          position: "left",
        },
        // { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/alexk111/node-red-contrib-btcpay",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Style Guide",
              to: "docs/",
            },
            {
              label: "Second Doc",
              to: "docs/doc2/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            // {
            //   label: "Stack Overflow",
            //   href: "https://stackoverflow.com/questions/tagged/docusaurus",
            // },
            // {
            //   label: "Discord",
            //   href: "https://discordapp.com/invite/docusaurus",
            // },
            {
              label: "Twitter",
              href: "https://twitter.com/RedBtcOrg",
            },
          ],
        },
        {
          title: "More",
          items: [
            // {
            //   label: "Blog",
            //   to: "blog",
            // },
            {
              label: "GitHub",
              href: "https://github.com/alexk111/node-red-contrib-btcpay",
            },
          ],
        },
      ],
      copyright: `Made by <a href="https://twitter.com/alex_kaul" target="_blank" rel="noreferrer noopener">@alex_kaul</a> <br/> This website does not use cookies nor collect personal data.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebarsDocs.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/alexk111/redbtc.org/edit/master/",
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl: "https://github.com/alexk111/redbtc.org/edit/master/blog/",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "flows",
        path: "flows",
        editUrl: "https://github.com/alexk111/redbtc.org/edit/master/",
        routeBasePath: "flows",
        sidebarPath: require.resolve("./sidebarsFlows.js"),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    ],
  ],
};
