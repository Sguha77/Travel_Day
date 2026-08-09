import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to lazy initialize GoogleGenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Parse trip details from email text or prompt
app.post("/api/parse-trip", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing text parameter" });
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback parser if no API key is set
      return res.json({
        origin: "San Francisco, CA",
        destination: "JFK Airport, NY",
        eventType: "flight",
        identifier: "UA 123",
        departureTime: "11:00",
        transitPreference: "rideshare",
        baggageDrop: true,
        tsaPrecheck: false,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Parse the following travel confirmation text or request into structured trip parameters:\n\n"${text}"`,
      config: {
        systemInstruction: "Extract travel details. Infer reasonable defaults for missing fields.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            origin: { type: Type.STRING, description: "Home address or origin location" },
            destination: { type: Type.STRING, description: "Destination airport or station name" },
            eventType: { type: Type.STRING, description: "'flight' or 'train'" },
            identifier: { type: Type.STRING, description: "Flight or train number, e.g., UA 123" },
            departureTime: { type: Type.STRING, description: "Departure time in HH:MM 24h format, e.g., 11:00" },
            transitPreference: { type: Type.STRING, description: "'drive', 'rideshare', 'transit', or 'walk'" },
            baggageDrop: { type: Type.BOOLEAN, description: "Whether checked baggage is needed" },
            tsaPrecheck: { type: Type.BOOLEAN, description: "Whether passenger has TSA PreCheck" },
          },
          required: ["origin", "destination", "eventType", "identifier", "departureTime"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error parsing trip:", error);
    res.status(500).json({ error: error.message || "Failed to parse trip" });
  }
});

// AI Travel Assistant
app.post("/api/travel-assistant", async (req, res) => {
  try {
    const { prompt, trip } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt parameter" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        answer: `For trip ${trip?.identifier || 'your flight'} to ${trip?.destination || 'your destination'}, make sure to keep your digital boarding pass handy, double-check terminal signage upon arrival, and aim to arrive 2 hours prior to departure for domestic flights.`,
      });
    }

    const tripContext = trip
      ? `Active Trip: ${trip.eventType === "train" ? "Train" : "Flight"} ${trip.identifier} from ${trip.origin} to ${trip.destination}, departing at ${trip.departureTime}. Preferences: ${trip.transitPreference}, Baggage Drop: ${trip.baggageDrop ? "Yes" : "No"}, TSA PreCheck: ${trip.tsaPrecheck ? "Yes" : "No"}.`
      : "No active trip loaded.";

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are Travel Day AI, an expert, concise travel day assistant. Context:\n${tripContext}\nProvide direct, practical advice without fluff. Keep responses under 120 words.`,
      },
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Error in travel assistant:", error);
    res.status(500).json({ error: error.message || "Failed to get travel advice" });
  }
});

async function startServer() {
  // Vite middleware in dev, static serving in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
