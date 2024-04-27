import { useRouteError, useLoaderData } from "@remix-run/react";

import { ThemeProvider } from "./contexts/ThemeContext";
import "./src/sass/index.scss";
import Main from "./Main";

import { json } from "@remix-run/node";

export function loader({ request }) {
  // Function to get cookies from the request headers
  function getCookies(request) {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) return {}; // Return empty object if no cookie header

    return Object.fromEntries(
      cookieHeader
        .split(";")
        .map((cookie) => {
          const parts = cookie.split("=");
          if (parts.length < 2) return [null, null]; // Handle malformed cookie parts
          const key = parts[0].trim();
          const value = parts.slice(1).join("=").trim(); // Properly handle cookies with '=' in the value
          return [key, value];
        })
        .filter((parts) => parts[0]), // Filter out null keys resulting from malformed cookies
    );
  }

  const cookies = getCookies(request);
  const theme = cookies.theme || "light"; // Default to 'light' if no theme cookie is set

  return json({ theme });
}

export default function App() {
  const { theme } = useLoaderData();
  return (
    <ThemeProvider initialTheme={theme}>
      <Main />
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return null;
  // return (
  //   // eslint-disable-next-line jsx-a11y/html-has-lang
  //   <html>
  //     <head>
  //       <title>Oh no!</title>
  //       <meta charSet="utf-8" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1" />
  //       <Meta />
  //       <Links />
  //     </head>
  //     <body>
  //       {/* The error UI for users */}
  //       <div
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           flexDirection: "column",
  //         }}
  //       >
  //         <h1>Oh no!</h1>
  //         <img src="./sad-kitten.avif" alt="sad kitten" width="500" />
  //         <p>
  //           Hopefully the NiceNode devs are working on a fix already. If you do
  //           not see a message from them on{" "}
  //           <a href="https://x.com/NiceNodeApp">X (Twitter)</a> or{" "}
  //           <a href="https://discord.gg/k3dpYU4Pn9">Discord</a>, please let them
  //           know!
  //         </p>
  //       </div>
  //       <Scripts />
  //     </body>
  //   </html>
  // );
}
