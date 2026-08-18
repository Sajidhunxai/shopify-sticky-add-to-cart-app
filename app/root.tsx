import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined;
const GOOGLE_ADS_CONVERSION = import.meta.env.VITE_GOOGLE_ADS_CONVERSION as
  | string
  | undefined;

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        {GOOGLE_ADS_ID ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GOOGLE_ADS_ID}');
                `,
              }}
            />
          </>
        ) : null}
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {GOOGLE_ADS_ID && GOOGLE_ADS_CONVERSION ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('click', function (event) {
                  var target = event.target.closest('[data-conversion]');
                  if (!target || typeof gtag !== 'function') return;
                  gtag('event', 'conversion', {
                    send_to: '${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION}'
                  });
                });
              `,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
