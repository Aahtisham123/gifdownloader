import { homeFaqs } from "@/config/home-faq";
import { site } from "@/config/site";
import { tools, type Tool } from "@/config/tools";
import type { Article } from "@/config/articles";

function absolute(path: string) {
  return path.startsWith("http") ? path : `${site.url}${path}`;
}

export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description: site.description,
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${site.url}/#app`,
        name: "Gif Downloader App",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        url: site.url,
        description: site.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "ItemList",
        name: "Gif Downloader tools",
        itemListElement: tools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: absolute(tool.href),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: homeFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

export function toolSchema(tool: Tool) {
  const url = absolute(tool.href);
  const crumbs = [
    { name: "Home", url: site.url },
    ...(tool.kind === "hub"
      ? []
      : [
          {
            name: tool.kind === "downloader" ? "Downloaders" : "GIF makers",
            url: absolute(tool.kind === "downloader" ? "/gif-downloader" : "/gif-maker"),
          },
        ]),
    { name: tool.name, url },
  ];
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebApplication",
      name: tool.name,
      url,
      description: tool.description,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isPartOf: { "@id": `${site.url}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    },
  ];
  if (tool.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: tool.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function articleSchema(article: Article, path: string) {
  const url = absolute(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        dateModified: article.updated,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: site.name, url: site.url },
        publisher: { "@type": "Organization", name: site.name, url: site.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: article.kind === "guide" ? "Guides" : "Blog",
            item: absolute(article.kind === "guide" ? "/guides" : "/blog"),
          },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };
}
