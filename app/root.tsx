import type { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen overflow-hidden border-t border-l border-r border-gray-400 px-3 py-10 bg-gray-200 flex justify-center pt-20 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-green-300 via-blue-500 to-purple-600">
        <div className="w-full max-w-screen-xl bg-white shadow-lg rounded-md mb-4 drop-shadow-md">
          <Outlet />
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  );
}
