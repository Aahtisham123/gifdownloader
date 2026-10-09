import type { Metadata } from "next";
import { LegalScreen } from "@/components/pages/legal-screen";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${site.name} is for: public GIF downloads and browser-made loops, without an account or a watermark.`,
  alternates: { canonical: "/about" },
};

export default function Page() {
  return (
    <LegalScreen
      title="About"
      lede="Gif Downloader is an independent studio for two jobs: saving a GIF that is already public, and making a new one without uploading the pictures."
    >
      <h2>What this is</h2>
      <p>
        Downloaders read a public page or a file link you paste. Makers draw each frame on your device. The two stay separate because one needs the network and the other should not.
      </p>
      <p>
        The site is not a social network, a host for other people’s GIFs, or a way into private accounts. If a post is locked, deleted, or only drawn after a script runs, there is nothing honest to fetch.
      </p>
      <h2>Who is behind it</h2>
      <p>
        Gif Downloader is an independent project. There is no app store listing and no affiliation with X, Pinterest, Discord, Tenor, or Giphy. The names appear so you know which link to paste.
      </p>
      <p>
        Questions, corrections, and takedown notices go through the contact page. That form opens your email app. It does not create an account.
      </p>
    </LegalScreen>
  );
}
