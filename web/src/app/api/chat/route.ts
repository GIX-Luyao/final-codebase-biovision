import { bedrock } from "@ai-sdk/amazon-bedrock";
import { streamText } from "ai";
import { parse } from "csv-parse/sync";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type CsvRow = Record<string, string>;

function parseCsvRows(csvText: string): CsvRow[] {
  return parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];
}

function buildStats(rows: CsvRow[]) {
  const animalCounts: Record<string, number> = {};
  let totalAnimals = 0;
  let totalBeavers = 0;
  let totalImages = rows.length;

  for (const row of rows) {
    const animalType = (row.animal_type || "").toLowerCase().trim();
    const hasBeaver = (row.has_beaver || "").toLowerCase() === "true";
    const hasAnimal = (row.has_animal || "").toLowerCase() === "true";

    if (hasBeaver) {
      totalBeavers += 1;
    }

    if (animalType && animalType !== "none") {
      animalCounts[animalType] = (animalCounts[animalType] || 0) + 1;
      totalAnimals += 1;
    } else if (hasAnimal) {
      totalAnimals += 1;
    }
  }

  const sortedAnimals = Object.entries(animalCounts).sort((a, b) => b[1] - a[1]);
  return {
    totalImages,
    totalAnimals,
    totalBeavers,
    animalCounts,
    sortedAnimals,
  };
}

function buildSystemPrompt(stats: ReturnType<typeof buildStats>, csvPath: string) {
  const summaryLines = stats.sortedAnimals.map(([animal, count]) => `- ${animal}: ${count}`);
  const summaryText =
    summaryLines.length > 0 ? summaryLines.join("\n") : "- no animals detected";

  return [
    "You are a wildlife dataset assistant.",
    "Answer ONLY using the dataset summary below. If a question cannot be answered, say so.",
    `CSV: ${path.basename(csvPath)}`,
    `Total images: ${stats.totalImages}`,
    `Total animals (any type): ${stats.totalAnimals}`,
    `Beaver detections: ${stats.totalBeavers}`,
    "Animal counts:",
    summaryText,
  ].join("\n");
}

function getLastUserText(messages: Array<{ role?: string; parts?: unknown[] }>) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message?.role !== "user") {
      continue;
    }
    const parts = Array.isArray(message.parts) ? message.parts : [];
    const text = parts
      .filter((part) => typeof part === "object" && part !== null && "type" in part)
      .filter((part) => (part as { type?: string }).type === "text")
      .map((part) => (part as { text?: string }).text ?? "")
      .join("")
      .trim();
    if (text) {
      return text;
    }
  }
  return "";
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const messages = Array.isArray(payload?.messages) ? payload.messages : [];
    const csvTextFromBody: string | undefined = payload?.csvText;
    const csvPath: string | undefined =
      payload?.csvPath || process.env.BEAVER_CHAT_CSV || process.env.BEAVER_OUTPUT;

    if (!csvTextFromBody && !csvPath) {
      return new Response(
        JSON.stringify({
          error: "CSV input missing. Upload a CSV or set BEAVER_CHAT_CSV / csvPath.",
        }),
        { status: 400 },
      );
    }

    const modelId =
      process.env.BEAVER_CHAT_MODEL_ID ||
      process.env.BEAVER_BEDROCK_MODEL_ID ||
      process.env.BEDROCK_MODEL_ID;

    if (!modelId) {
      return new Response(
        JSON.stringify({ error: "Missing Bedrock model id. Set BEAVER_CHAT_MODEL_ID." }),
        { status: 400 },
      );
    }

    const csvText = csvTextFromBody ?? (await fs.readFile(csvPath!, "utf8"));
    const rows = parseCsvRows(csvText);
    const stats = buildStats(rows);
    const system = buildSystemPrompt(stats, csvPath ?? "uploaded.csv");
    const prompt = getLastUserText(messages);

    if (!prompt) {
      return new Response(JSON.stringify({ error: "No user message provided." }), {
        status: 400,
      });
    }

    const result = await streamText({
      model: bedrock(modelId),
      system,
      prompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
