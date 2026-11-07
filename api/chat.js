import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Dozwolone jest tylko POST." });
  }

  try {
    const messages = Array.isArray(req.body?.messages)
      ? req.body.messages
          .filter(m =>
            ["user", "assistant"].includes(m.role) &&
            typeof m.content === "string"
          )
          .slice(-24)
      : [];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Jesteś NOVA, inteligentnym i pomocnym asystentem AI. Rozmawiasz po polsku, odpowiadasz naturalnie, jasno i konkretnie. Nie zmyślasz faktów."
        },
        ...messages
      ]
    });

    return res.status(200).json({
      reply: response.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Nie udało się uzyskać odpowiedzi. Sprawdź konfigurację API."
    });
  }
}
