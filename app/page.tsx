import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { HomeSections } from "@/components/home/sections";
import { PageFrame } from "@/components/layout/page-frame";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";
import { homeSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
  },
};

export default function Page() {
  return (
    <PageFrame>
      <JsonLd data={homeSchema()} />
      <Hero />
      <HomeSections />
    </PageFrame>
  );
}
