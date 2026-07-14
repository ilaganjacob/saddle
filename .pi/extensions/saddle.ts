import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("saddle-status", {
    description: "Show Saddle platform status",
    handler: async (_args, ctx) => {
      const tenants = ["elm", "htss", "personal"];
      const lines = [
        "🐴  Saddle Agent Platform",
        "━━━━━━━━━━━━━━━━━━━━━━━",
        `Tenants: ${tenants.length}`,
        ...tenants.map((t) => `  • ${t}  [offline]`),
        "━━━━━━━━━━━━━━━━━━━━━━━",
        "Phase 0 — project setup in progress",
      ];
      ctx.ui.notify(lines.join("\n"), "info");
    },
  });
}