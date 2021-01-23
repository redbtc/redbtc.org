import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const backerSlotsNum = 10;

function getFeatures() {
  return [
    {
      title: "Visual Tool",
      description: (
        <>
          Automate your Bitcoin-related routines and build applications
          visually, by connecting nodes in flows.
        </>
      ),
    },
    {
      title: "Node-RED Ecosystem",
      description: (
        <>
          Integrate your BTCPay Server instance with the Node-RED ecosystem
          comprising of more than 2,000 community-built nodes for various online
          services, databases and IoT devices.
        </>
      ),
    },
    {
      title: "Example Flows",
      description: (
        <>
          <Link to={useBaseUrl("flows/")}>Ready-made example flows</Link> would
          help you to start making your BTCPay Server integrations immediately.
        </>
      ),
    },
  ];
}

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Backer(idx) {
  return (
    <a href={`https://mynode.redbtc.org/gh-backer/top/${idx}/profile`} rel="noopener nofollow" target="_blank" key={idx}>
      <img className={styles.backerImage} src={`https://mynode.redbtc.org/gh-backer/top/${idx}/avatar/60`} alt="Red BTC Backer" />
    </a>
  )
}

function getBackers() {
  const backers = [];
  for (let i = 0; i < backerSlotsNum; i++) {
    backers.push(Backer(i))
  }
  return backers;
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  const features = getFeatures();
  const backers = getBackers();

  return (
    <Layout
      title={siteConfig.tagline}
      description="Integrate BTCPay Server with online services, APIs and hardware devices, and develop apps on top of it, visually with Node-RED and BTCPay Nodes"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <img
            className={styles.heroImage}
            src="img/logo-nodes.svg"
            alt="Red BTC logo"
          />
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">
            Integrate{" "}
            <a
              href="https://btcpayserver.org/"
              target="_blank"
              rel="noreferrer noopener"
            >
              BTCPay Server
            </a>{" "}
            with online services, APIs and hardware devices, and develop apps on
            top of it, visually with{" "}
            <a
              href="https://nodered.org/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Node-RED
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/redbtc/node-red-contrib-btcpay"
              target="_blank"
              rel="noreferrer noopener"
            >
              BTCPay Nodes
            </a>
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--primary button--xlg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <section className={styles.backers}>
          <div className="container">
            <h4 className={styles.backersTitle}>
              Backers
            </h4>
            <p>
              {backers}
            </p>
            <p>
              Thank you for your support! 🙌
            </p>
            <p>
              <Link
                className={clsx(
                  "button button--outline button--primary",
                  styles.becomeBacker
                )}
                to="https://mynode.redbtc.org/gh-donate"
              >
                Donate
              </Link>
            </p>
          </div>
        </section>

      </main>
    </Layout>
  );
}

export default Home;
