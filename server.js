import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Brak klucza API. Uzupełnij plik .env." });
    }
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const safeMessages = messages
      .filter(m => ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .slice(-24);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Jesteś NOVA — pomocnym, inteligentnym i naturalnym asystentem AI. Rozmawiasz po polsku, chyba że użytkownik poprosi o inny język. Odpowiadasz jasno, konkretnie i życzliwie. Jeśli czegoś nie wiesz, mówisz o tym wprost. Nie zmyślasz faktów."
        },
        ...safeMessages
      ],
      temperature: 0.7
    });
    res.json({ reply: response.choices[0]?.message?.content || "Nie udało mi się przygotować odpowiedzi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wystąpił problem z odpowiedzią AI. Sprawdź klucz API i spróbuj ponownie." });
  }
});

app.listen(port, () => console.log(`NOVA działa: http://localhost:${port}`));