import type { Metadata } from "next";
import { LegalScreen } from "@/components/pages/legal-screen";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `${site.name} is not affiliated with X, Pinterest, Discord, Tenor, or Giphy.`,
  alternates: { canonical: "/disclaimer" },
};

export default function Page() {
  return (
    <LegalScreen
      title="Disclaimer"
      lede={`${site.name} is not affiliated with X, Pinterest, Discord, Tenor, or Giphy. Only download content you own or have permission to use.`}
    >
      <h2>Names and marks</h2>
      <p>
        X, Twitter, Pinterest, Discord, Tenor, and Giphy are named so you can tell which link a tool accepts. Those names belong to their owners. Gif Downloader does not use their logos, and it is not a partner, client, or endorsed product.
      </p>
      <h2>What a download means</h2>
      <p>
        Finding a file on a public page does not mean you have a license to repost it, sell it, or drop it into an ad. The tool moves bytes. It does not clear rights.
      </p>
      <h2>Accuracy</h2>
      <p>
        Size limits and URL patterns are kept in one config file and updated when we know a platform has changed. A guide can still be wrong for a week. If a number on a platform’s own help page disagrees with ours, trust the platform and tell us.
      </p>
    </LegalScreen>
  );
}
