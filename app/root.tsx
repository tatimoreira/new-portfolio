import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import clsx from "clsx";
import { useLoaderData } from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import stylesheet from "./tailwind.css";
import type { Theme } from "~/utils/theme-provider";
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from "~/utils/theme-provider";
import type { LoaderFunction } from "@remix-run/node";
import { getThemeSession } from "./utils/theme.server";
import { Analytics } from "@vercel/analytics/react"
import { useEffect } from "react";

export type LoaderData = {
  theme: Theme | null;
};

/*export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}*/

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);

  const data: LoaderData = {
    theme: themeSession.getTheme(),
  };

  return data;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }, { rel: "stylesheet", href: stylesheet }];
};

const SITE_URL = "https://www.tatimoreira.me";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Tatiana Moreira | Software Engineer",
  viewport: "width=device-width,initial-scale=1",
  description:
    "Tatiana Moreira is a software engineer building web applications with Rust, TypeScript, and React. Personal portfolio and blog.",
  "og:type": "website",
  "og:url": SITE_URL,
  "og:title": "Tatiana Moreira | Software Engineer",
  "og:description":
    "Tatiana Moreira is a software engineer building web applications with Rust, TypeScript, and React.",
  "og:site_name": "Tatiana Moreira",
  "twitter:card": "summary",
  "twitter:title": "Tatiana Moreira | Software Engineer",
  "twitter:description":
    "Tatiana Moreira is a software engineer building web applications with Rust, TypeScript, and React.",
});

export function App() {
  const [theme] = useTheme();
  const data = useLoaderData<LoaderData>();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('../mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass',
        })
      })
    }
  }, [])
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Tatiana Moreira",
              url: "https://www.tatimoreira.me",
              jobTitle: "Software Engineer",
              description:
                "Software engineer building web applications with Rust, TypeScript, and React.",
              sameAs: [
                "https://github.com/tatemoreira",
                "https://www.linkedin.com/in/tatemoreira",
              ],
            }),
          }}
        />
      </head>
      <body className="h-full">

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (

    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>

  );
}
