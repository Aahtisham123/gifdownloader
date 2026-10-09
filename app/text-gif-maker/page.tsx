import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("text-gif-maker");

export default function Page() {
  return <ToolRoute slug="text-gif-maker" />;
}
