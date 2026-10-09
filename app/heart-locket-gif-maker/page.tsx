import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("heart-locket-gif-maker");

export default function Page() {
  return <ToolRoute slug="heart-locket-gif-maker" />;
}
