import type { Metadata } from "next";
import Link from "next/link";
import { LegalScreen } from "@/components/pages/legal-screen";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "DMCA",
  description: `How to send ${site.name} a copyright takedown notice.`,
  alternates: { canonical: "/dmca" },
};

export default function Page() {
  return (
    <LegalScreen
      title="DMCA"
      lede={`Copyright notices go to ${site.email}. A complete notice is the one we can act on.`}
    >
      <h2>What to include</h2>
      <p>Send an email with:</p>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        <li>Your physical or electronic signature.</li>
        <li>The work you say was copied, described well enough to find it.</li>
        <li>The exact Gif Downloader URL, or the source URL the downloader was pointed at.</li>
        <li>Your name, email, and a phone number or mailing address.</li>
        <li>A statement that you believe the use is not authorized by the owner, the owner’s agent, or the law.</li>
        <li>A statement, under penalty of perjury, that the notice is accurate and that you are the owner or authorized to act for the owner.</li>
      </ul>
      <h2>What we do</h2>
      <p>
        {site.name} does not host a public gallery of other people’s GIFs. Makers do not upload your files to us. If a notice is about a page on this site, we will remove or disable the material that the notice identifies. If a notice is only about a third-party page, we cannot remove that page from the other site.
      </p>
      <p>
        Counter-notices can be sent to the same address and should include the material that was removed, a statement under penalty of perjury that the removal was a mistake, your contact details, and consent to jurisdiction as the statute requires.
      </p>
      <p>
        The shorter version of this policy sits on every downloader: we are not affiliated with the platforms, and you should only download what you have permission to use. Questions that are not takedowns can use the <Link href="/contact">contact form</Link>.
      </p>
    </LegalScreen>
  );
}
