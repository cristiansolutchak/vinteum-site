import { getPosts } from "@/lib/ghost";
import type { GhostPost } from "@/lib/ghost";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinteum.org";
const FEED_URL = `${SITE_URL}/blog/rss.xml`;
const SITE_TITLE = "Vinteum Blog";
const SITE_DESCRIPTION = "Vinteum - Open Source Bitcoin Development";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function toRfc822(iso: string): string {
    return new Date(iso).toUTCString();
}

function buildItem(post: GhostPost): string {
    const link = `${SITE_URL}/blog/${post.slug}`;
    const description = post.custom_excerpt ?? post.excerpt ?? "";
    const author = post.primary_author?.name ?? post.authors?.[0]?.name ?? "Vinteum";
    const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag.name)}</category>`)
        .join("");

    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${toRfc822(post.published_at)}</pubDate>
      <description>${escapeXml(description)}</description>
      <dc:creator>${escapeXml(author)}</dc:creator>
      ${categories}
    </item>`;
}

export async function GET() {
    let posts: GhostPost[] = [];
    try {
        posts = (await getPosts({ limit: "all" })).posts;
    } catch (error) {
        console.warn("rss.xml: could not load blog posts, returning empty feed", error);
    }

    const lastBuildDate =
        posts.length > 0 ? toRfc822(posts[0].published_at) : new Date().toUTCString();

    const items = posts.map(buildItem).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
