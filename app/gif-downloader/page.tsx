import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("gif-downloader");

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ToolRoute slug="gif-downloader" searchParams={searchParams} />;
}
