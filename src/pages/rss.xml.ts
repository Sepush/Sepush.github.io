import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { ContentType, getAllContent } from "../utils";

export async function GET(context: APIContext) {
  const allContent = await getAllContent();
  const rssItems = allContent.map((item) => ({
    title: item.data.title,
    pubDate: item.data.pubDate,
    description: item.type === ContentType.Posts
      ? (item.data.description || "")
      : (item.data.content || ""),
    link: item.type === ContentType.Posts ? `/posts/${item.slug}/` : `/notes/${item.slug}/`,
    categories: item.data.tags || [],
    author: "Artea",
    content: item.body ? item.body.slice(0, 500) + "..." : undefined,
  }));

  return rss({
    title: "Artea's Blog",
    description: "一个自说自话的博客",
    site: context.site!,
    items: rssItems,
    customData: `<language>zh-cn</language>`,
  });
}
