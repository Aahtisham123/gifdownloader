import type { Metadata } from "next";
import { ContentHub } from "@/components/pages/content-hub";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on the GIF: its history, the pronunciation fight, and why social apps turn loops into video.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return <ContentHub kind="blog" />;
}
