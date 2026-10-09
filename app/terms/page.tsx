import type { Metadata } from "next";
import { LegalScreen } from "@/components/pages/legal-screen";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `The rules for using ${site.name}: public content only, no abuse of the downloader, and no warranty on the output.`,
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return (
    <LegalScreen
      title="Terms"
      lede="Use the tools for content you have the right to use. Do not point the downloader at private networks or at material you are not allowed to copy."
    >
      <h2>The service</h2>
      <p>
        {site.name} provides browser tools and a fetcher for public media links. Features can change or break when a third-party site changes. Unofficial lookups, including anything that depends on X, Pinterest, Tenor, or Giphy, can fail without notice.
      </p>
      <h2>Your content</h2>
      <p>
        You are responsible for the files you upload into a maker and the links you ask us to fetch. Only download content you own or have permission to use. We do not claim rights in your photos or in the GIFs you export.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not use the downloader to reach internal networks, cloud metadata addresses, or anything that is not a public http(s) resource. Do not hammer the fetcher. Do not use the site to distribute malware or to impersonate X, Pinterest, Discord, Tenor, or Giphy.
      </p>
      <h2>No warranty</h2>
      <p>
        The tools are provided as-is. A conversion can look different from the source. A link can expire. We are not liable for lost files, missed downloads, or how you use an export after it leaves the page.
      </p>
      <h2>Contact</h2>
      <p>Questions about these terms go to {site.email}.</p>
    </LegalScreen>
  );
}
