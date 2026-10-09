import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("my-beloved-gif-maker");

export default function Page() {
  return <ToolRoute slug="my-beloved-gif-maker" />;
}
