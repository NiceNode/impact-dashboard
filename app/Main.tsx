import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "@remix-run/react";
import { useState, useEffect } from "react";

import { useTheme } from "./contexts/ThemeContext";
import FilterButton from "./FilterButton";
import { ThemeContextType } from "./contexts/ThemeContext";

export default function Main() {
  const { theme, toggleTheme } = useTheme() as ThemeContextType;
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const main = document.querySelector("main");
      if (!main) return; // Ensure `main` exists

      const headerTop = main.getBoundingClientRect().top;
      if (headerTop === 62) {
        setIsMinimized(false);
      } else if (headerTop <= 95 && headerTop !== 62) {
        setIsMinimized(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (event) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={theme}>
        <div id="topOfPage"></div>
        <header className={isMinimized ? "minimized" : ""}>
          <div className="logo">
            <Link to="/#topOfPage" onClick={scrollToTop}></Link>
          </div>
          <nav>
            <FilterButton />
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
            <li className="switch" onClick={toggleTheme}></li>
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
        <script src="/app/src/js/index.js"></script>
      </body>
    </html>
  );
}
