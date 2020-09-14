module.exports = {
  title: "Red BTC",
  tagline: "Integrate BTCPay Server with anything",
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
    prism: {
      theme: require("prism-react-renderer/themes/nightOwlLight"),
    },
    image: "img/redbtc-og.png",
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
          position: "right",
        },
        {
          to: "flows/",
          activeBasePath: "flows",
          label: "Flows",
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
              label: "Getting Started",
              to: "docs/",
              target: "_self",
            },
            {
              label: "Example Flows",
              to: "flows/",
              target: "_self",
            },
          ],
        },
        {
          title: "GitHub Repos",
          items: [
            {
              label: "BTCPay Node",
              href: "https://github.com/alexk111/node-red-contrib-btcpay",
            },
            {
              label: "BtcRed.org",
              href: "https://github.com/alexk111/redbtc.org",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              html: `<a href="https://donate.alexkaul.com/redbtc" target="_blank" rel="noopener noreferrer" class="footer__link-item">Donate<span class="link-icon">💝</span></a>`,
            },
            {
              label: "Twitter",
              href: "https://twitter.com/RedBtcOrg",
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
        docLayoutComponent: require.resolve("./src/components/FlowsDocPage"),
        editUrl: "https://github.com/alexk111/redbtc.org/edit/master/",
        routeBasePath: "flows",
        sidebarPath: require.resolve("./sidebarsFlows.js"),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    ],
  ],
};
