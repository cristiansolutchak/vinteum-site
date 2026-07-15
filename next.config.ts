import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Short links: add new entries here as { source, destination }
const redirects = [
    {
        source: "/ics",
        destination:
            "https://calendar.google.com/calendar/u/2?cid=Y184MTlmMmNjMThhY2UzODNjOWQ2OGFlOGJkNTAzZjU0ZDUxYjkzODFhMDBhYTcxMWFkOTBlYWUzZjZmNWQwZmUxQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20",
        permanent: false,
    },
    {
        source: "/rss.xml",
        destination: "/blog/rss.xml",
        permanent: true,
    },
];

const nextConfig: NextConfig = {
    async redirects() {
        return redirects;
    },
    images: {
        unoptimized: isDev,
        remotePatterns: [
            // Ghost local development
            { protocol: "http", hostname: "localhost", port: "2368" },
            // Ghost production
            { protocol: "https", hostname: "blog.vinteum.org" },
            { protocol: "https", hostname: "*.vinteum.org" },
            // Ghost default image sources
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "static.ghost.org" },
        ],
    },
};

export default nextConfig;
