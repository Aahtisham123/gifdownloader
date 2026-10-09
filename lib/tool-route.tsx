import type { Metadata } from "next";
import { getTool } from "@/config/tools";
import { ToolScreen } from "@/components/pages/tool-screen";

export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: tool.href },
    openGraph: {
      title: tool.name,
      description: tool.description,
      url: tool.href,
    },
  };
}

export function ToolRoute({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ToolScreen tool={getTool(slug)} searchParams={searchParams} />;
}
