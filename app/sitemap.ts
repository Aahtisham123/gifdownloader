import type { MetadataRoute } from "next";
import { articles } from "@/config/articles";
import { site } from "@/config/site";
import { tools } from "@/config/tools";

const pages = ["/", "/guides", "/blog", "/about", "/contact", "/privacy", "/terms", "/disclaimer", "/dmca"];

export default function sitemap(): MetadataRoute.Sitemap {
  const dated = site.updated;
  return [
    ...pages.map((path) => ({
      url: path === "/" ? site.url : `${site.url}${path}`,
      lastModified: dated,
    })),
    ...tools.map((tool) => ({
      url: `${site.url}${tool.href}`,
      lastModified: dated,
    })),
    ...articles.map((article) => ({
      url: `${site.url}/${article.kind === "guide" ? "guides" : "blog"}/${article.slug}`,
      lastModified: article.updated,
    })),
  ];
}
