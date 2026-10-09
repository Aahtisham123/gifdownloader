import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { LegalScreen } from "@/components/pages/legal-screen";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Write to ${site.name} about a broken link, a takedown, or a tool that misbehaved.`,
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <LegalScreen
      title="Contact"
      lede="Send a note about a broken tool, a correction, or a file you need taken down. The form checks the fields, then opens your email app."
    >
      <ContactForm />
      <p>
        You can also write directly to {site.email}. For copyright notices, use the DMCA page so the request includes what the process needs.
      </p>
    </LegalScreen>
  );
}
