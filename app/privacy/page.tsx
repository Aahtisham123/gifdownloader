import type { Metadata } from "next";
import { LegalScreen } from "@/components/pages/legal-screen";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles maker files, downloader links, and the contact form.`,
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return (
    <LegalScreen
      title="Privacy"
      lede="Maker files stay in the browser. Downloader links are used to fetch public media and are not kept afterward."
    >
      <h2>Files you make</h2>
      <p>
        GIF makers process pictures, video, and text on your device, in the page. Those files are not uploaded to {site.name}. Presets you save live in this browser’s local storage, and you can clear them with the site data in your browser.
      </p>
      <h2>Links you paste</h2>
      <p>
        A downloader sends the address to our server so it can fetch a public page or file and hand the media back to you. The address is not stored after the request. Full links, including query strings, are not written to logs. We do not try to open private, login-only, or protected content.
      </p>
      <p>
        Rate limiting may keep an IP address in memory for a short time so one network cannot hammer the fetcher. That record is not a browsing history.
      </p>
      <h2>Contact</h2>
      <p>
        The contact form does not submit to a database. It opens your email app addressed to {site.email}. If you send that email, we receive whatever you put in it, and we use it to answer you.
      </p>
      <h2>Cookies, ads, and analytics</h2>
      <p>
        The theme choice is stored in local storage, not a cookie. Advertising and analytics are off unless they are explicitly enabled for a deployment. A consent banner is shown only in that case. This deployment does not set analytics cookies.
      </p>
      <h2>Questions</h2>
      <p>
        Write to {site.email} if you want to know what a particular request did. There is no account to delete, because there are no accounts.
      </p>
    </LegalScreen>
  );
}
