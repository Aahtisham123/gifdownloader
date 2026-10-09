import type { Metadata } from "next";
import { ContentHub } from "@/components/pages/content-hub";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "How to download GIFs from X, Pinterest, and Discord, shrink the file, and keep transparency from looking ragged.",
  alternates: { canonical: "/guides" },
};

export default function Page() {
  return <ContentHub kind="guide" />;
}
