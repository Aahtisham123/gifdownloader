import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("gif-meme-maker");

export default function Page() {
  return <ToolRoute slug="gif-meme-maker" />;
}
