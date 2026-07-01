import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/ghost";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinteum.org";

export const revalidate = 3600;

const STATIC_ROUTES: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
}[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.9 },
    { path: "/blog", changeFrequency: "daily", priority: 0.8 },
    { path: "/programs/grants", changeFrequency: "monthly", priority: 0.8 },
    { path: "/programs/fellowship", changeFrequency: "monthly", priority: 0.8 },
    { path: "/programs/mastering-seminars", changeFrequency: "monthly", priority: 0.8 },
    { path: "/programs/bitcoin-dev-launchpad", changeFrequency: "monthly", priority: 0.8 },
    { path: "/bitdevs", changeFrequency: "monthly", priority: 0.7 },
    { path: "/supporters", changeFrequency: "monthly", priority: 0.7 },
    { path: "/donate", changeFrequency: "monthly", priority: 0.7 },
    { path: "/newsletter", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
        ({ path, changeFrequency, priority }) => ({
            url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
            lastModified: now,
            changeFrequency,
            priority,
        })
    );

    let postEntries: MetadataRoute.Sitemap = [];
    try {
        const { posts } = await getPosts({ limit: "all" });
        postEntries = posts.map((post) => ({
            url: `${SITE_URL}/blog/${post.slug}`,
            lastModified: new Date(post.updated_at),
            changeFrequency: "monthly",
            priority: 0.6,
        }));
    } catch (error) {
        console.warn("sitemap: could not load blog posts, using static routes only", error);
    }

    return [...staticEntries, ...postEntries];
}
