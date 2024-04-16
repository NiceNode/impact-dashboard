import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { useTheme } from "./contexts/ThemeContext";

export default function Main() {
  const { theme, setTheme } = useTheme();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <script src="/app/src/js/index.js"></script>
      <body className={theme}>
        <div id="topOfPage"></div>
        <header id="test">
          <div className="logo">
            <a href="#topOfPage"></a>
          </div>
          <nav>
            <div className="links">
              <div className="filterButton black buttonDropdown">
                <div className="filterContainer">
                  Overview<div className="down"></div>
                </div>
                <div className="filterMenu">
                  <div className="filterText">
                    <a id="appleSiliconDownloadLink" download>
                      Overview
                    </a>
                  </div>
                  <div className="filterText">
                    <a id="appleIntelDownloadLink" download>
                      Ethereum
                    </a>
                  </div>
                  <div className="filterText">
                    <a id="appleSiliconDownloadLink" download>
                      Farcaster
                    </a>
                  </div>
                  <div className="filterText">
                    <a id="appleIntelDownloadLink" download>
                      Optimism
                    </a>
                  </div>
                  <div className="filterText">
                    <a id="appleSiliconDownloadLink" download>
                      Arbitrum
                    </a>
                  </div>
                  <div className="filterText">
                    <a id="appleIntelDownloadLink" download>
                      Livepeer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <ul className="icons">
            <li className="twitter">
              <a
                href="https://twitter.com/nicenodeapp"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </li>
            <li className="github">
              <a
                href="https://github.com/NiceNode/nice-node"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </li>
            <li className="discord">
              <a
                href="https://discord.gg/k3dpYU4Pn9"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </li>
            <li
              className="switch"
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
              }}
            ></li>
          </ul>
        </header>
        <main>
          <Outlet />
          <section id="learn">
            <div className="learn-container">
              <div className="content">
                <h3>Run a node and become part of a global revolution.</h3>
                <h4>Available for MacOS, Windows and Linux.</h4>
                <div>
                  <a
                    className="button small"
                    href="https://nicenode.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <div className="image-container">
                <div className="image"></div>
              </div>
            </div>
          </section>
        </main>
        <footer>
          <div className="logoContainer">
            <div className="logo"></div>
            <div className="text">NiceNode</div>
          </div>
          <div className="social-links">
            <a
              className="button small"
              href="https://twitter.com/nicenodeapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              className="button small"
              href="https://discord.gg/k3dpYU4Pn9"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
            <a
              className="button small"
              href="https://github.com/NiceNode/nice-node"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </div>
          <div className="copyright">© Copyright 2024 by NiceNode.</div>
          <div className="terms">
            <ul className="links">
              <li className="requirements">
                <a className="link" href="/terms">
                  Terms of Service
                </a>
              </li>
              <li className="download">
                <a className="link" href="/privacy">
                  Privacy Notice
                </a>
              </li>
            </ul>
          </div>
        </footer>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
