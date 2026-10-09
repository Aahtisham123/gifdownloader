import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("transparent-gif-maker");

export default function Page() {
  return <ToolRoute slug="transparent-gif-maker" />;
}
