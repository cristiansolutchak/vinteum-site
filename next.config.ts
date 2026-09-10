import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Short links: add new entries here as { source, destination }
const redirects = [
    {
        source: "/ics",
        destination:
            "https://calendar.google.com/calendar/ical/c_819f2cc18ace383c9d68ae8bd503f54d51b9381a00aa711ad90eae3f6f5d0fe1%40group.calendar.google.com/public/basic.ics",
        permanent: false,
    },
    {
        source: "/rss.xml",
        destination: "/blog/rss.xml",
        permanent: true,
    },
    {
        source: "/4",
        destination: "/assets/files/Vinteum-Year-Four-Report-2026.pdf",
        permanent: true,
    },
    {
        source: "/3",
        destination: "/assets/files/vinteum-3-years-report.pdf",
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
