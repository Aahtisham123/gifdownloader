import { toolMetadata, ToolRoute } from "@/lib/tool-route";

export const metadata = toolMetadata("pet-gif-maker");

export default function Page() {
  return <ToolRoute slug="pet-gif-maker" />;
}
