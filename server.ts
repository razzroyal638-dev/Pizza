import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API route
  app.post("/api/ai-chat", async (req, res) => {
    const { prompt, menuData } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Menu Data: ${JSON.stringify(menuData)}\n\nUser Query: ${prompt}`,
        config: {
          systemInstruction: `You are a helpful and friendly assistant for BarbieCorn Pizza. Help customers search our menu and give recommendations based on their cravings. 
          Use the provided menu data to answer questions and provide accurate prices. If an item is not in the menu data, say you don't have it.
          Return a JSON object in the following format:
          {
            "message": "A friendly response message",
            "items": [
              {
                "name": "Item Name",
                "description": "Brief description",
                "price": "Number only (use this if only one price exists)",
                "regular": "Price for Regular (optional)",
                "medium": "Price for Medium (optional)",
                "large": "Price for Large (optional)"
              }
            ]
          }
          If no items match, return an empty array for items. Do not include currency symbols in the price.`,
          responseMimeType: "application/json",
        },
      });
      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("Gemini API error:", error);
      const statusCode = error.status || error.statusCode || 500;
      if (statusCode === 503) {
        res.status(503).json({ error: "The AI is currently busy. Please try again in a moment." });
      } else {
        res.status(500).json({ error: "Failed to get AI response" });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
