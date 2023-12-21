import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
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
