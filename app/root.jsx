import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
} from "@remix-run/react";

import globalCSS from "~/styles/global.css";
import { getUser } from '~/utils/session.server';

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }) {
  const { user } = useLoaderData();
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <>
            <li>
              <form action='/auth/logout' method='POST'>
                <button type='submit' className='btn'>
                  Logout {user.username}
                </button>
              </form>
            </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/auth">Sign in</Link>
              </li>
              <li>
                <Link to="/auth?actionType=register">Sign up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="container">{children}</div>
    </>
  );
}

export const loader = async ({ request, params }) => {
  const user = await getUser(request);
  return { user };
};

export const links = () => {
  return [{ rel: "stylesheet", href: globalCSS }];
};

export function ErrorBoundary({ errorParam }) {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <Layout>
          <h1>Oops</h1>
          <p>Status: {error.status}</p>
          <p>{error.data.message}</p>
        </Layout>
      </Document>
    );
  }
  return (
    <Document>
      <Layout>
        <h1>Uh oh ...</h1>
        <p>Something went wrong.</p>
        <pre>{errorParam?.message}</pre>
        <p>The stack trace is:</p>
        <pre>{errorParam?.stack}</pre>
      </Layout>
    </Document>
  );
}