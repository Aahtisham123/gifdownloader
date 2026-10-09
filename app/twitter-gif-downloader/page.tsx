import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("twitter-gif-downloader");

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ToolRoute slug="twitter-gif-downloader" searchParams={searchParams} />;
}
