import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("gif-caption-maker");

export default function Page() {
  return <ToolRoute slug="gif-caption-maker" />;
}
