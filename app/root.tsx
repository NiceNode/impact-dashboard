import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import { Button, Theme } from "@itsmapleleaf/radix-themes";
import { useState } from "react";
import NavBar from "./NavBar";

import "@itsmapleleaf/radix-themes/styles.css";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme appearance={theme}>
          <NavBar
            theme
            onToggleTheme={() => {
              console.log(theme);
              setTheme(theme === "light" ? "dark" : "light");
            }}
          />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Theme>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html>
      <head>
        <title>Oh no!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* The error UI for users */}
        <div style={{display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'}}>
          <h1>Oh no!</h1>
          <img src="./sad-kitten.avif" alt="sad kitten" width='500'/>
          <p>Hopefully the NiceNode devs are working on a fix already. If you do not see a message from them on <a href="https://x.com/NiceNodeApp">X (Twitter)</a> or <a href="https://discord.gg/k3dpYU4Pn9">Discord</a>, please let them know!</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
