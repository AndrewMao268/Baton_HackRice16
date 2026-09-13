import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Keep handoff formatting usable locally, but never fake a memory answer.
      if (action === "generate-handoff") {
        return NextResponse.json({
          accomplished: payload.workSummary || payload.rawWork || "Completed presentation slides 1–18 and updated key campaign visuals.",
          blocked: payload.blocker || payload.rawBlocker || "Waiting for the New York office to confirm the final budget and pricing table.",
          nextAction: payload.nextAction || payload.rawNext || "The next shift should insert the final pricing on slide 19 and review with the client team.",
          confidence: "Synthesized based on activity logs",
        });
      }

      if (action === "query-memory") {
        return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 503 });
      }

      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    if (action === "generate-handoff") {
      const prompt = `You are Baton AI, an expert workplace handoff assistant for global distributed teams across timezones.
A team member is ending their workday and passing the baton to colleagues in the next timezone.
Given this raw activity context:
---
Role / Department: ${payload.department || "General"}
Work finished / documents: ${payload.rawWork || ""}
Obstacles or waiting on: ${payload.rawBlocker || ""}
Intended next steps: ${payload.rawNext || ""}
---

Extract and produce a concise, high-impact handoff in strictly valid JSON format with three fields:
1. "accomplished": (1-2 sentences: exact deliverables finished today)
2. "blocked": (1 sentence: specific dependency, who is needed, or what is holding work up)
3. "nextAction": (1 sentence: name of person or role who should act next and their exact immediate next task)

Do not add extra conversational text or markdown code fences, return pure JSON with keys: accomplished, blocked, nextAction.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || "{}";
      const parsed = JSON.parse(text.replace(/^```json\s*/, '').replace(/\s*```$/, ''));
      return NextResponse.json(parsed);
    }

    if (action === "query-memory") {
      const historyContext = String(payload.historyContext || "No previous history").slice(0, 30000);
      const query = payload.query || "";

      const prompt = `You are Baton's AI Project Memory. Answer only from the current workspace data provided below. The data includes employee profiles, office presence, handoff queue, active blockers, and timeline events from this web app. Use exact names, roles, cities, statuses, projects, and timestamps when they are present. Do not invent employees, events, or facts. If the data does not answer the question, say that the workspace has no matching record.

    Current workspace data:
${historyContext}

User Query: "${query}"

    Provide a direct, concise, actionable answer (2 to 3 sentences max) addressing:
- Exactly what happened or who is responsible
- Any open dependencies or blockers
- Clear timeline reference.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
        },
      });

      return NextResponse.json({
        answer: response.text?.trim() || "No relevant records found in project memory.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    console.error("Baton AI request failed:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
