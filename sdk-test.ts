// Saddle SDK test — creates an agent session programmatically
import { createAgentSession } from "@earendil-works/pi-coding-agent";

async function main() {
  const { session } = await createAgentSession({
    provider: "openrouter",
    model: "openrouter/deepseek/deepseek-chat",
    sessionDir: "/opt/saddle/.saddle-sessions",
    // No extensions, no TUI — pure headless agent
    noExtensions: true,
    noContextFiles: true,
  });

  try {
    session.subscribe((event) => {
      if (
        event.type === "message_update" &&
        event.assistantMessageEvent.type === "text_delta"
      ) {
        process.stdout.write(event.assistantMessageEvent.delta);
      }
    });

    await session.prompt("What is 2+2? Answer in one word.");
    console.log("\n--- Done ---");
  } finally {
    session.dispose();
  }
}

main().catch(console.error);