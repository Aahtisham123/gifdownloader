import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("gif-maker");

export default function Page() {
  return <ToolRoute slug="gif-maker" />;
}
